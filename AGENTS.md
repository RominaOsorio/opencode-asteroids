# AGENTS.md

## What this is

Vanilla HTML5 Canvas **Asteroids** game. ES6+ classes in a single file, no modules,
no bundler, no package.json, no build/test/lint tooling.

## Run / verify

- Open `index.html` directly in a browser, or `npx serve .` → http://localhost:3000
- There are no tests or linters. Verify by manual play in the browser.

## Structure & wiring

- `game.js` — all game logic (state machine `playing`/`dead`/`gameover` in `update()`), loaded via plain `<script src="game.js">` in `index.html` (no `import`/`export`; everything is global-scope).
- Gravity-free physics with toroidal edges via `wrap()` (game.js:27).
- Loop in `loop()` (game.js:414): dt is clamped to 0.05s — time-based logic must stay `dt`-scaled.
- Fixed resolution: `W`/`H` constants at game.js:5-6 must match the canvas `width`/`height` attrs in index.html.
- Fire uses frame-level edge detection (`pressed()` consumes `justPressed`) plus a shoot cooldown.

## Conventions

- UI strings are Spanish (HUD, GAME OVER, README) — keep new UI text in Spanish.
- Comments in `game.js` are Spanish section banners (`// ── Input ──...`).
- No dependencies — add features in `game.js` only, with the same header-comment style.
