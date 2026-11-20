# Pi Learning Config

Run Pi as a tutor on macOS, Linux, or Windows. The launcher loads the [learning skill](skills/learn/SKILL.md) as session instructions. Pi renders math in the terminal and uses TFormula for typeset equation images in supported terminals. The Pi Learn header shows your configured shortcuts.

## Install

You'll need Git and Node.js 22.19 or newer with npm. Keep the checkout in a directory you control.

### macOS, Linux, or WSL

```sh
git clone https://github.com/IsaacAnwar/pi-learning-config.git
cd pi-learning-config
./install.sh
~/.local/bin/pi-learn
```

### Native Windows

In [Windows Terminal with Git for Windows](https://docs.pi.dev/latest/windows), run these commands in PowerShell.

```powershell
git clone https://github.com/IsaacAnwar/pi-learning-config.git
cd pi-learning-config
npm.cmd run setup
node .\bin\pi-learn.mjs
```

Both installers use the same npm lockfile. They skip dependency lifecycle scripts during installation. Linux runs the locked `node-pty` build separately when TFormula needs it. For that build, install Python 3, make, and a C/C++ toolchain, such as `python3` and `build-essential` on Debian or Ubuntu. If the renderer is unavailable, Pi can still start with its own math renderer.

Setup seeds the dark theme, streaming Mermaid, and keyboard shortcuts when the corresponding settings files are absent. It uses Pi's usual settings, sessions, and authentication directory, or the directory you set with `PI_CODING_AGENT_DIR`.

In a fresh Pi session use `/login` for a supported sign-in, then `/model` to select a model. Try asking “Why does cross-entropy penalize confident wrong predictions? Show the formula and compare two probabilities.” The skill puts the answer first, explains the mechanism, and adds a worked example when it helps. Use `/skill:learn` to invoke it explicitly.

TFormula is optional on macOS and Linux. Equation images require a compatible Kitty graphics terminal such as Herdr, Ghostty, Kitty, or WezTerm. Native Windows, tmux, and other terminals use Pi's built-in math rendering. If a terminal identifies itself as compatible but fails to show images, set `PI_LEARN_MATH=0` when launching. Print, JSON, and RPC modes launch directly through Pi.

## Use in Herdr

Use the full launcher path printed by `./install.sh` as the value in `programs.pi.run` in `~/.config/herdr-app/programs.json`.

```json
{
  "programs": {
    "pi": {
      "run": ["<full launcher path printed by the installer>"]
    }
  }
}
```

Merge this entry into the existing JSON, then start a new Pi session from Herdr's agent menu. The wrapper uses Pi's regular terminal mode so Herdr can display the equation images.

## Customize

- Edit [the learning skill](skills/learn/SKILL.md) and start a new session to pick up changes.
- On an existing Pi installation, you can install just the skill with `pi install git:github.com/IsaacAnwar/pi-learning-config` and invoke it with `/skill:learn`.
- The original header and the `/clear`, `/exit`, and `/session-usage` extensions are in [the optional Herdr package](config/extras). Install it with `~/.local/bin/pi-learn install "$PWD/config/extras"` from this checkout if those commands aren't already installed. The [Open TUI preferences](config/open-tui.json) are for the optional `pi-open-tui` package.
- For the original add-ons, add the package sources from [the Herdr settings example](config/settings.herdr.json) to your Pi settings. Pi installs the configured packages on the next launch.
- Run `git pull --ff-only` and repeat the setup command for your platform to update.

[Pi documentation](https://docs.pi.dev/) · [TFormula](https://github.com/mikewang817/TFormula) · [Original Herdr configuration](https://github.com/IsaacAnwar/herdr-config)
