# Pi Learn

Use the [README installation instructions](README.md#install) for a new checkout or an extracted ZIP. Use the [setup skill](.claude/skills/setup-pi-learn/SKILL.md) to guide installation and verification.

- Run setup from the Pi Learn repository. On macOS, Linux, and WSL, `sh ./install.sh` adds the per-user launcher. The npm setup and start commands also work from the checkout. Herdr is an optional launcher.
- Resolve bundled files from the launcher, installer, or module location. Resolve the Pi profile using Pi's configuration rules. Keep credentials, local settings, and personal paths out of tracked files.
- Keep dependencies reproducible with `runtime/package-lock.json`. Preserve the Pi renderer fallback when TFormula or Kitty graphics are unavailable.
- For changes to setup or launch, verify a clean install with spaces in the checkout and profile paths, then use the installed launcher from a different directory. Check that setup preserves existing settings and keybindings. Use a temporary profile for verification.
