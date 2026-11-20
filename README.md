# Pi Learning Config

Run Pi as a tutor from Herdr or a terminal that supports Kitty graphics. The launcher loads the [learning skill](skills/learn/SKILL.md) as session instructions and sends Pi's display LaTeX to TFormula for typesetting. The compact Pi Learn header shows your configured shortcuts, with more shortcuts and loaded resources available through the expand key.

## Install

You'll need Git and Node.js 22.19 or newer with npm. Run this on macOS or Linux from a directory where you want to keep the checkout.

```sh
git clone https://github.com/IsaacAnwar/pi-learning-config.git
cd pi-learning-config
./install.sh
~/.local/bin/pi-learn
```

The installer downloads Pi 1.5.2 and TFormula 0.3.1 into the checkout and links the launcher into `~/.local/bin`. It seeds the dark theme, streaming Mermaid, and keyboard shortcuts when the corresponding Pi settings files are absent. It uses Pi's usual settings, sessions, and authentication directory, or the directory you set with `PI_CODING_AGENT_DIR`.

In a fresh Pi session use `/login` for a supported sign-in, then `/model` to select a model. Try asking “Why does cross-entropy penalize confident wrong predictions? Show the formula and compare two probabilities.” The skill puts the answer first, explains the mechanism, and adds a worked example when it helps. Use `/skill:learn` to invoke it explicitly.

If your terminal lacks Kitty graphics support, start with `PI_LEARN_MATH=0 ~/.local/bin/pi-learn` to use Pi's built-in math rendering. Print, JSON, and RPC modes also launch directly through Pi.

## Use in Herdr

Set `programs.pi.run` in `~/.config/herdr-app/programs.json` to the installed launcher. Use your full home path so Herdr can find it.

```json
{
  "programs": {
    "pi": {
      "run": ["/Users/you/.local/bin/pi-learn"]
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
- Run `git pull --ff-only` and `./install.sh` in the checkout to update.

[Pi documentation](https://docs.pi.dev/) · [TFormula](https://github.com/mikewang817/TFormula) · [Original Herdr configuration](https://github.com/IsaacAnwar/herdr-config)
