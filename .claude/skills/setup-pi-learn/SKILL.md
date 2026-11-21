---
name: setup-pi-learn
description: Install, update, or diagnose the Pi Learn tutoring launcher from this repository and verify it starts in a standalone terminal.
---

# Set up Pi Learn

Locate the Pi Learn checkout or extracted ZIP and read its [install instructions](../../../README.md#install) and [repository guidance](../../../AGENTS.md). Check the operating system and that Node.js 22.19 or newer and npm are available.

- On macOS, Linux, or WSL, use `sh ./install.sh` to register the per-user launcher. For a checkout-only install, use `npm run setup`, then `npm start` from the checkout.
- On native Windows, run `npm.cmd run setup` and `npm.cmd start` from the checkout in Windows Terminal.
- Reuse the checkout for updates. Preserve any existing Pi profile or launcher, and use the launch command printed by setup. Configure Herdr only when requested.

Verify with `~/.local/bin/pi-learn --version` for the per-user launcher, or `npm start -- --version` from the checkout (`npm.cmd start -- --version` on Windows). Tell the user how to start a session and use Pi's `/login` and `/model` if their provider needs setup.

If TFormula is unavailable, verify Pi starts with its built-in math renderer. Use the README's [terminal math section](../../../README.md#terminal-math) for terminal requirements and the fallback flag.
