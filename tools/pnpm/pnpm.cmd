@echo off
REM Project-local pnpm shim: route every bare `pnpm` call to the pinned
REM corepack version (pnpm@11.18.0 per package.json packageManager field).
REM The machine's npm-global pnpm (v10.x here) has a broken drive-relative
REM store-dir and crashes with 0xC0000142/-90 on install; do not use it.
REM Usage: set PATH so tools/pnpm comes FIRST, or call via `corepack pnpm`.
corepack pnpm %*