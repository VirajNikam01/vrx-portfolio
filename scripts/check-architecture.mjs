import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import assert from "node:assert/strict";
import ts from "typescript";

const ownership = {
    content_configs: ["content-configs", "content-configs"],
    inquiries: ["inquiries", "inquiries"],
    visitors: ["visitors", "visitors"],
    recommendations: ["recommendations", "recommendations"],
    recommendation_topics: ["recommendation-topics", "recommendation-topics"],
};

const componentLevels = { atoms: 0, molecules: 1, organisms: 2 };

function componentLevel(file) {
    const level = file.match(/^app\/(?:.*\/)?components\/(atoms|molecules|organisms)\//)?.[1];
    return level === undefined ? undefined : componentLevels[level];
}

export function readSources(root) {
    const sources = new Map();
    function walk(directory) {
        if (!fs.existsSync(directory)) return;
        for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
            const absolute = path.join(directory, entry.name);
            if (entry.isDirectory()) walk(absolute);
            else if (/\.(?:tsx?|jsx?|mjs)$/.test(entry.name)) {
                sources.set(path.relative(root, absolute).replaceAll("\\", "/"), fs.readFileSync(absolute, "utf8"));
            }
        }
    }
    for (const folder of ["backend", "shared", "features", "components", "hooks", "providers", "app", "lib", "config", "actions", "data"]) {
        walk(path.join(root, folder));
    }
    return sources;
}

export function checkArchitecture(sources) {
    const errors = [];
    const graph = new Map();
    const clientRoots = [];
    function resolve(from, specifier) {
        const base = specifier.startsWith("@/") ? specifier.slice(2)
            : specifier.startsWith(".") ? path.posix.normalize(path.posix.join(path.posix.dirname(from), specifier)) : null;
        if (!base) return null;
        return [base, ...[".ts", ".tsx", ".js", ".jsx", ".mjs", "/index.ts", "/index.tsx"].map(ext => base + ext)]
            .find(candidate => sources.has(candidate)) ?? base;
    }
    for (const table of Object.keys(ownership)) {
        if (!sources.has(`backend/repository/${table}.ts`)) errors.push(`Missing repository: ${table}`);
    }
    for (const [file, source] of sources) {
        if (file.startsWith("features/") || file.startsWith("components/") || file.startsWith("backend/handlers/")) errors.push(`${file}: use route-local components and API handlers`);
        const ast = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true);
        const imports = [];
        function add(specifier, typeOnly = false) {
            if (specifier && ts.isStringLiteralLike(specifier)) {
                imports.push({ specifier: specifier.text, target: resolve(file, specifier.text), typeOnly });
            }
        }
        function visit(node) {
            if (ts.isImportDeclaration(node)) {
                const clause = node.importClause;
                const bindings = clause?.namedBindings;
                const onlyTypes = clause?.isTypeOnly || (!clause?.name && bindings && ts.isNamedImports(bindings)
                    && bindings.elements.length > 0 && bindings.elements.every(element => element.isTypeOnly));
                add(node.moduleSpecifier, Boolean(onlyTypes));
            } else if (ts.isExportDeclaration(node)) {
                add(node.moduleSpecifier, node.isTypeOnly);
            } else if (ts.isCallExpression(node) && (node.expression.kind === ts.SyntaxKind.ImportKeyword
                || (ts.isIdentifier(node.expression) && node.expression.text === "require"))) {
                add(node.arguments[0]);
            }
            ts.forEachChild(node, visit);
        }
        visit(ast);
        graph.set(file, imports.filter(edge => !edge.typeOnly));
        if (/^(features|components|hooks|providers|lib\/api)\//.test(file) || /^app\/(?:.*\/)?components\//.test(file)
            || ast.statements.some(node => ts.isExpressionStatement(node) && ts.isStringLiteral(node.expression) && node.expression.text === "use client")) {
            clientRoots.push(file);
        }
        const repository = file.match(/^backend\/repository\/(.+)\.ts$/)?.[1];
        if (repository && !ownership[repository]) errors.push(`${file}: repository has no table ownership`);
        if (file.startsWith("backend/") && !file.includes("/schema") && !file.includes("/seed-data/")
            && !imports.some(edge => edge.specifier === "server-only")) errors.push(`${file}: missing server-only guard`);
        for (const edge of imports) {
            const target = edge.target ?? edge.specifier;
            const sourceLevel = componentLevel(file);
            const targetLevel = componentLevel(target);
            if (sourceLevel !== undefined && targetLevel !== undefined && targetLevel > sourceLevel) {
                errors.push(`${file}: atomic component imports a higher UI layer ${target}`);
            }
            const targetTable = target.match(/^backend\/repository\/(.+)\.ts$/)?.[1];
            if (clientRoots.includes(file) && target.startsWith("backend/")) errors.push(`${file}: frontend imports backend ${target}`);
            if (targetTable && file !== `backend/services/${ownership[targetTable]?.[0]}.ts`) {
                errors.push(`${file}: only the owner service may import ${target}`);
            }
            if (file.startsWith("backend/") && /^(features\/|app\/|components\/|hooks\/|lib\/api\/)/.test(target)) errors.push(`${file}: backend imports frontend or route ${target}`);
            if (file.startsWith("shared/") && /^(backend|features|components|providers|hooks|app)\//.test(target)) errors.push(`${file}: contract imports runtime layer ${target}`);
            if (repository && target.startsWith("backend/") && target !== "backend/db/client.ts"
                && target !== `backend/db/schema/${ownership[repository]?.[1]}.ts`) errors.push(`${file}: foreign persistence dependency ${target}`);
            if (target === "backend/db/client.ts" && !repository) errors.push(`${file}: database access outside repository`);
            if ((edge.specifier === "postgres" && file !== "backend/db/client.ts")
                || (edge.specifier.startsWith("drizzle-orm") && !repository && !file.startsWith("backend/db/"))) {
                errors.push(`${file}: database driver outside persistence layer`);
            }
            if (repository && !edge.target && !["server-only", "drizzle-orm"].includes(edge.specifier)) errors.push(`${file}: external dependency in repository`);
            if (!edge.typeOnly && target.startsWith("backend/db/schema") && !repository && !file.startsWith("backend/db/")) errors.push(`${file}: runtime schema access outside repository`);
            if ((file.startsWith("backend/handlers/") || file.startsWith("app/api/"))
                && /^(backend\/(repository|db|integrations)|drizzle-orm|postgres|@supabase|resend|rss-parser)/.test(target)) errors.push(`${file}: handler bypasses service ${target}`);
            if (file.startsWith("backend/services/") && (target.startsWith("backend/handlers/") || target.startsWith("app/api/"))) errors.push(`${file}: service imports handler`);
            if (file.startsWith("backend/services/") && /^(next\/|react$)/.test(edge.specifier)) errors.push(`${file}: service depends on UI or HTTP framework`);
        }
    }
    const forbiddenBrowserImport = /^(backend\/|server-only$|node:|postgres$|drizzle-orm|@supabase\/supabase-js|resend$|rss-parser$)/;
    function walkClient(file, chain, seen) {
        if (seen.has(file)) return;
        seen.add(file);
        for (const edge of graph.get(file) ?? []) {
            const target = edge.target ?? edge.specifier;
            if (forbiddenBrowserImport.test(target)) errors.push(`Browser boundary: ${[...chain, file, target].join(" -> ")}`);
            else if (edge.target) walkClient(edge.target, [...chain, file], seen);
        }
    }
    for (const root of clientRoots) walkClient(root, [], new Set());
    function walkService(file, chain) {
        if (chain.includes(file)) { errors.push(`Service cycle: ${[...chain, file].join(" -> ")}`); return; }
        for (const edge of graph.get(file) ?? []) {
            if (edge.target?.startsWith("backend/services/")) walkService(edge.target, [...chain, file]);
        }
    }
    for (const file of sources.keys()) if (file.startsWith("backend/services/")) walkService(file, []);
    return [...new Set(errors)];
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
    const sources = readSources(process.cwd());
    const errors = checkArchitecture(sources);
    if (errors.length) { console.error(errors.join("\n")); process.exitCode = 1; }
    else console.log("Architecture checks passed: table ownership, import boundaries, and service dependencies.");
    if (process.argv.includes("--self-test")) {
        for (const [file, source, expected] of [
            ["app/components/atoms/invalid.tsx", 'import "@/app/components/molecules/theme-toggle";', "higher UI layer"],
            ["app/recommendations/components/molecules/invalid.tsx", 'import "@/app/recommendations/components/organisms/topic-detail";', "higher UI layer"],
            ["backend/handlers/obsolete.ts", 'import "server-only";', "use route-local"],
            ["features/obsolete.ts", 'export {};', "use route-local"],
            ["backend/services/blog.ts", 'import "server-only"; export * from "../repository/visitors";', "only the owner"],
            ["backend/repository/visitors.ts", 'import "server-only"; import { recommendations } from "../db/schema/recommendations";', "foreign persistence"],
            ["lib/leaked.ts", 'export * from "@/backend/services/visitors";', "Browser boundary"],
            ["backend/services/recommendations.ts", 'import "server-only"; import "./recommendation-topics";', "Service cycle"],
        ]) {
            const changed = new Map(sources);
            changed.set(file, source);
            if (file === "lib/leaked.ts") changed.set("app/components/leaked.ts", 'import "@/lib/leaked";');
            assert(checkArchitecture(changed).some(error => error.includes(expected)), `Guard failed: ${expected}`);
        }
        console.log("Architecture regression checks passed.");
    }
}
