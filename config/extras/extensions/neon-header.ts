import type { ExtensionAPI, ExtensionContext } from "@earendil-works/pi-coding-agent";
import { VERSION } from "@earendil-works/pi-coding-agent";
import { truncateToWidth } from "@earendil-works/pi-tui";

/** A wide, terminal-native π mark. No images, fonts, or animation required. */
export default function (pi: ExtensionAPI) {
  function install(ctx: ExtensionContext) {
    if (ctx.mode !== "tui") return;

    ctx.ui.setHeader((_tui, theme) => ({
      render(width: number): string[] {
        const accent = (text: string) => theme.fg("accent", text);
        const muted = (text: string) => theme.fg("muted", text);
        const dim = (text: string) => theme.fg("dim", text);
        const title = theme.bold(accent("P I"));
        const lines = width < 48
          ? ["", `  ${title} ${dim(`/ v${VERSION}`)}`, `  ${muted("build something brilliant.")}`, ""]
          : [
              "",
              `  ${accent("▄▄▄▄▄▄▄▄▄▄▄▄▄")}    ${title} ${dim(`/ v${VERSION}`)}`,
              `  ${accent("▀▀██▀▀▀██▀▀▀▀")}    ${muted("YOUR TERMINAL. SUPERCHARGED.")}`,
              `  ${accent("  ██   ██    ")}`,
              `  ${accent("  ██   ██    ")}    ${dim("build something brilliant.")}`,
              `  ${accent("  ▀▀   ▀▀    ")}    ${muted("/help")} ${dim("commands ·")} ${muted("/settings")} ${dim("preferences")}`,
              "",
            ];
        return lines.map((line) => truncateToWidth(line, Math.max(0, width)));
      },
      // Styles are computed on each render so theme changes work immediately.
      invalidate() {},
    }));
  }

  pi.on("session_start", (_event, ctx) => install(ctx));
  pi.registerCommand("neon-header", {
    description: "Restore the custom block-style Pi banner",
    handler: async (_args, ctx) => install(ctx),
  });
  pi.registerCommand("default-header", {
    description: "Restore Pi's built-in header for this session",
    handler: async (_args, ctx) => {
      if (ctx.mode === "tui") ctx.ui.setHeader(undefined);
    },
  });
}
