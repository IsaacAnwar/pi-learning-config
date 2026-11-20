import { VERSION, keyText, type ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { truncateToWidth, visibleWidth } from "@earendil-works/pi-tui";
// The stock logo renderer is internal to the Pi version pinned in runtime/.
import { piLogoLines, supportsPiLogo } from "../runtime/node_modules/@earendil-works/pi-coding-agent/dist/modes/interactive/components/pi-logo.js";

export default function (pi: ExtensionAPI) {
  // Run after session_start so the Herdr profile's older banners can initialize first.
  pi.on("resources_discover", (_event, ctx) => {
    if (ctx.mode !== "tui" || pi.getSettings().quietStartup === true) return;

    ctx.ui.setHeader((_tui, theme) => {
      let expanded = false;
      const hint = (key: string, label: string) =>
        key ? theme.fg("text", key) + theme.fg("muted", ` ${label}`) : "";

      return {
        setExpanded(value: boolean) {
          expanded = value;
        },
        invalidate() {},
        render(width: number) {
          const logo = width >= 30 && supportsPiLogo() ? piLogoLines() : undefined;
          const gutter = logo ? " ".repeat(visibleWidth(logo[0]) + 3) : width >= 2 ? " " : "";
          const title = theme.bold(theme.fg("text", "Pi Learn")) + theme.fg("muted", `  v${VERSION}`);
          const lines = [logo ? ` ${logo[0]}  ${title}` : gutter + title];
          let prefix = logo ? ` ${logo[1]}  ` : gutter;
          const separator = theme.fg("dim", "  ·  ");
          const hints = [
            hint(keyText("app.interrupt"), "interrupt"),
            hint(keyText("app.clear"), "clear"),
            hint(keyText("app.exit"), "exit"),
            hint("/", "commands"),
            hint("!", "bash"),
          ];
          if (expanded) {
            hints.push(
              hint(keyText("app.model.select"), "select model"),
              hint(keyText("app.thinking.cycle"), "cycle thinking"),
              hint("/skill:learn", "teaching guide"),
              hint("/hotkeys", "all shortcuts"),
            );
          }

          let row = "";
          for (const item of hints.filter(Boolean)) {
            const next = row ? row + separator + item : item;
            if (row && visibleWidth(prefix + next) > width) {
              lines.push(prefix + row);
              prefix = gutter;
              row = item;
            } else {
              row = next;
            }
          }
          if (row) lines.push(prefix + row);

          const expandKey = keyText("app.tools.expand");
          const action = expanded ? "hide" : "show";
          const details = hint(expandKey, expanded ? "hide startup details" : "show startup details and loaded resources");
          if (details) {
            const fits = visibleWidth(gutter + details) <= width;
            lines.push(gutter + (fits ? details : hint(expandKey, `${action} details`)));
          }
          return lines.map((line) => truncateToWidth(line, width));
        },
      };
    });
  });
}
