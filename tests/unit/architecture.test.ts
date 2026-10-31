import { execFileSync } from "node:child_process";

it("enforces table ownership and rejects foreign repositories, frontend leaks, and service cycles", () => {
    expect(execFileSync(process.execPath, ["scripts/check-architecture.mjs", "--self-test"], {
        cwd: process.cwd(), encoding: "utf8",
    })).toContain("Architecture regression checks passed.");
});
