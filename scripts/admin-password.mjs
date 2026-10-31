import fs from "node:fs";
import { randomBytes, scryptSync } from "node:crypto";

if (process.stdin.isTTY) {
    console.error("Pipe a password through standard input. In PowerShell: Read-Host -MaskInput 'New password' | node scripts/admin-password.mjs");
    process.exit(1);
}
let password = "";
for await (const chunk of process.stdin) password += chunk;
password = password.replace(/\r?\n$/, "");
if (!password.length || password.length > 1024) { console.error("Use a password between 1 and 1024 characters."); process.exit(1); }
const salt = randomBytes(16);
const key = scryptSync(password, salt, 64, { N: 65536, r: 8, p: 2, maxmem: 128 * 1024 * 1024 });
const values = {
    ADMIN_PASSWORD_HASH: `scrypt:65536:8:2:${salt.toString("hex")}:${key.toString("hex")}`,
    ADMIN_CREDENTIAL_VERSION: randomBytes(16).toString("hex"),
};
let source = fs.existsSync(".env") ? fs.readFileSync(".env", "utf8") : "";
for (const [name, value] of Object.entries(values)) {
    const pattern = new RegExp(`^${name}=.*$`, "m");
    source = pattern.test(source) ? source.replace(pattern, () => `${name}=${value}`) : `${source.replace(/\s*$/, "")}\n${name}=${value}\n`;
}
fs.writeFileSync(".env", source);
console.log("Private admin password configuration updated. Restart the server; previous sessions will no longer be valid.");
