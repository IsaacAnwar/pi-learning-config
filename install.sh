#!/bin/sh
set -eu

root=$(CDPATH= cd -- "$(dirname "$0")" && pwd -P)
bin_dir="$HOME/.local/bin"
launcher="$bin_dir/pi-learn"

if [ -e "$launcher" ] || [ -L "$launcher" ]; then
  if [ ! -L "$launcher" ] || [ "$(readlink "$launcher")" != "$root/bin/pi-learn" ]; then
    printf 'Move the existing %s before installing.\n' "$launcher" >&2
    exit 1
  fi
fi

if ! command -v npm >/dev/null 2>&1; then
  printf 'Install Node.js 22.19 or newer with npm first.\n' >&2
  exit 1
fi
npm --prefix "$root" run setup

# Some ZIP extractors drop the executable bit.
if [ ! -x "$root/bin/pi-learn" ]; then
    chmod u+x "$root/bin/pi-learn"
fi
mkdir -p "$bin_dir"
if [ ! -L "$launcher" ]; then
  ln -s "$root/bin/pi-learn" "$launcher"
fi
printf 'Start Pi with %s\n' "$launcher"
