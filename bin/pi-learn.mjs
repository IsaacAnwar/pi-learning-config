import { existsSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

const root = join(import.meta.dirname, "..");
const packages = join(root, "runtime", "node_modules");
const pi = join(packages, "@earendil-works", "pi-coding-agent", "dist", "bundle", "cli.js");
const tformula = join(packages, "tformula", "dist", "cli.js");
const skill = join(root, "skills", "learn", "SKILL.md");
const args = process.argv.slice(2);

if (!existsSync(pi)) {
  console.error("Run npm run setup from the Pi Learning Config checkout before starting Pi.");
  process.exit(1);
}

const adminCommands = new Set(["install", "remove", "uninstall", "update", "list", "config", "auth", "mcp"]);
const nonInteractiveFlags = new Set([
  "-p", "--print", "--mode", "--export", "--list-models", "-h", "--help", "-v", "--version",
]);

let entry = pi;
let launchArgs = args;
if (!adminCommands.has(args[0])) {
  const separator = args.indexOf("--");
  const flags = separator < 0 ? args : args.slice(0, separator);
  const interactive = process.stdin.isTTY && process.stdout.isTTY &&
    !flags.some((arg) => nonInteractiveFlags.has(arg) || arg.startsWith("--mode="));
  launchArgs = ["--skill", skill, "--append-system-prompt", skill, ...args];

  if (interactive) {
    launchArgs.unshift("--extension", join(root, "integrations", "learning-header.ts"));
    const { PI_LEARN_MATH, TERM, TERM_PROGRAM, TMUX, STY, ZELLIJ, MOSH_CONNECTION, TFORMULA_ACTIVE } = process.env;
    const wrapped = TFORMULA_ACTIVE === "1";
    const multiplexer = TMUX || STY || ZELLIJ || MOSH_CONNECTION || /^(screen|tmux)([-.]|$)/i.test(TERM ?? "");
    const kittyTerminal = !multiplexer && /ghostty|kitty|wezterm/i.test(`${TERM ?? ""} ${TERM_PROGRAM ?? ""}`);
    const rendererReady = existsSync(tformula) && existsSync(join(packages, ".tformula-ready"));

    if (PI_LEARN_MATH !== "0" && (wrapped || (rendererReady && kittyTerminal))) {
      // Herdr displays TFormula's image placements on the regular screen.
      launchArgs.unshift("--tui-mode", "regular", "--extension", join(root, "integrations", "raw-latex.ts"));
      if (!wrapped) {
        entry = tformula;
        launchArgs = ["--no-history", "--", process.execPath, pi, ...launchArgs];
      }
    }
  }
}

// Load the pinned CLI entrypoint with its normal argv and the original terminal.
process.argv = [process.execPath, entry, ...launchArgs];
await import(pathToFileURL(entry).href);
