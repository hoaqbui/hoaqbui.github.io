#!/usr/bin/env bash
# Publish the site without GitHub Actions (user, 2026-10-23: "Don't use GitHub actions").
# Builds on this machine and pushes the static export to the gh-pages branch, which GitHub Pages
# serves (Settings › Pages: Deploy from a branch, gh-pages, /). Run from a clean checkout of main:
#   scripts/deploy.sh
set -euo pipefail
cd "$(git rev-parse --show-toplevel)"
if [ -n "$(git status --porcelain --untracked-files=no)" ]; then
  echo "deploy: commit or stash your changes first — the site must match a commit" >&2; exit 1
fi
sha=$(git rev-parse --short HEAD)
pnpm install --frozen-lockfile
pnpm depcruise
rm -rf out && pnpm build
touch out/.nojekyll  # Jekyll would drop _next/ otherwise
test -f out/CNAME && test -f out/index.html
pages=$(mktemp -d)
trap 'git worktree remove --force "$pages" >/dev/null 2>&1 || true' EXIT
if git ls-remote --exit-code --heads origin gh-pages >/dev/null; then
  git fetch -q origin gh-pages
  git worktree add -q -f "$pages" origin/gh-pages
  git -C "$pages" checkout -q -B gh-pages
else
  git worktree add -q --detach "$pages"
  git -C "$pages" checkout -q --orphan gh-pages
fi
git -C "$pages" rm -rqf --ignore-unmatch . >/dev/null  # -f: a new orphan branch starts with every file staged
cp -R out/. "$pages"/
git -C "$pages" add -A
if git -C "$pages" diff --cached --quiet; then echo "deploy: gh-pages already matches $sha"; exit 0; fi
git -C "$pages" commit -q -m "Deploy $sha"
git -C "$pages" push -q origin gh-pages
echo "deploy: published $sha to gh-pages"
