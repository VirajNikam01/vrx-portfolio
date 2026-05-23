import http from "node:http";
import { spawn } from "node:child_process";

const port = 3100;
const baseUrl = `http://localhost:${port}`;
const isWindows = process.platform === "win32";

const npmCommand = isWindows ? "npm.cmd" : "npm";
const npxCommand = isWindows ? "npx.cmd" : "npx";

function spawnCommand(command, args) {
  return spawn(command, args, {
    cwd: process.cwd(),
    env: process.env,
    shell: isWindows,
    stdio: "inherit",
  });
}

function waitForServer(url, timeoutMs = 120_000) {
  const startedAt = Date.now();

  return new Promise((resolve, reject) => {
    const check = () => {
      const request = http.get(url, (response) => {
        response.resume();
        resolve();
      });

      request.on("error", () => {
        if (Date.now() - startedAt > timeoutMs) {
          reject(new Error(`Timed out waiting for ${url}`));
          return;
        }

        setTimeout(check, 500);
      });
    };

    check();
  });
}

function stopProcessTree(child) {
  if (!child.pid || child.exitCode !== null) {
    return;
  }

  if (isWindows) {
    spawn("taskkill", ["/pid", String(child.pid), "/t", "/f"], {
      stdio: "ignore",
    });
    return;
  }

  child.kill("SIGTERM");
}

const server = spawnCommand(npmCommand, ["run", "start", "--", "-p", String(port)]);

const stopServer = () => stopProcessTree(server);
process.on("exit", stopServer);
process.on("SIGINT", () => {
  stopServer();
  process.exit(130);
});
process.on("SIGTERM", () => {
  stopServer();
  process.exit(143);
});

try {
  await waitForServer(baseUrl);

  const testExitCode = await new Promise((resolve) => {
    const playwright = spawnCommand(npxCommand, ["playwright", "test"]);
    playwright.on("exit", (code) => resolve(code ?? 1));
  });

  stopServer();
  process.exit(testExitCode);
} catch (error) {
  console.error(error);
  stopServer();
  process.exit(1);
}
