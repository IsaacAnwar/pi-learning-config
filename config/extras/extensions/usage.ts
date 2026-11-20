import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";

export default function (pi: ExtensionAPI) {
  pi.registerCommand("session-usage", {
    description: "Show recorded usage for the current provider in this Pi session",
    handler: async (_args, ctx) => {
      const provider = ctx.model?.provider;
      if (!provider) {
        ctx.ui.notify("No model is selected.", "warning");
        return;
      }

      let calls = 0;
      let input = 0;
      let output = 0;
      let cacheRead = 0;
      let cacheWrite = 0;
      let cost = 0;

      // getEntries includes the whole saved session (including alternate branches).
      for (const entry of ctx.sessionManager.getEntries()) {
        const record = entry.type === "message" && entry.message.role === "assistant"
          ? entry.message
          : entry.type === "usage" ? entry : null;
        if (!record || record.provider !== provider) continue;
        const usage = record.usage;
        calls++;
        input += usage.input;
        output += usage.output;
        cacheRead += usage.cacheRead;
        cacheWrite += usage.cacheWrite;
        cost += usage.cost.total;
      }

      ctx.ui.notify(
        `${provider} — Pi session usage (${calls} recorded calls)\n` +
        `Input: ${input.toLocaleString()} · Output: ${output.toLocaleString()}\n` +
        `Cache read: ${cacheRead.toLocaleString()} · Cache write: ${cacheWrite.toLocaleString()}\n` +
        `Estimated cost: $${cost.toFixed(4)}\n` +
        "This is recorded session usage, not your provider account quota or remaining balance.",
        "info",
      );
    },
  });
}
