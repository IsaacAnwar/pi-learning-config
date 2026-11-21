import { spawnSync } from "node:child_process";
import { constants, copyFileSync, existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";

const npm = process.env.npm_execpath;
if (!npm) {
  console.error("Run npm run setup from this checkout.");
  process.exit(1);
}

const runtime = import.meta.dirname;
const root = dirname(runtime);

function runNpm(args, env = process.env) {
  const result = spawnSync(process.execPath, [npm, ...args], { cwd: runtime, env, stdio: "inherit" });
  if (result.error) throw result.error;
  return result.status ?? 1;
}

const status = runNpm(["ci", "--engine-strict", "--ignore-scripts", "--include=optional"]);
if (status !== 0) process.exit(status);

const renderer = join(runtime, "node_modules", "tformula", "dist", "cli.js");
if (existsSync(renderer)) {
  const requireRenderer = createRequire(renderer);
  if (process.platform === "linux") {
    try {
      requireRenderer("node-pty");
    } catch {
      // The locked node-pty release ships prebuilds for macOS and Windows.
      // node-gyp's generated include flags can break when the home path contains spaces.
      const headerCache = mkdtempSync(join(tmpdir(), "pi-learn-node-gyp-"));
      try {
        runNpm(["rebuild", "node-pty", "--ignore-scripts=false", "--foreground-scripts"], {
          ...process.env,
          npm_config_devdir: headerCache,
        });
      } finally {
        rmSync(headerCache, { recursive: true, force: true });
      }
    }
  }

  try {
    requireRenderer("node-pty");
    requireRenderer("@resvg/resvg-js");
    writeFileSync(join(runtime, "node_modules", ".tformula-ready"), "");
  } catch (error) {
    console.warn(`TFormula unavailable (${error.message}). Pi will use its built-in math renderer.`);
  }
}

const { getAgentDir } = await import("@earendil-works/pi-coding-agent");
const agentDir = resolve(process.env.INIT_CWD || root, getAgentDir());
mkdirSync(agentDir, { recursive: true });
for (const file of ["settings.json", "keybindings.json"]) {
  try {
    copyFileSync(join(root, "config", file), join(agentDir, file), constants.COPYFILE_EXCL);
  } catch (error) {
    if (error.code !== "EEXIST") throw error;
  }
}

console.log("Start Pi from this folder with npm start.");
