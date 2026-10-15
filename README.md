# 🌭 Woofdoku

A cute logic puzzle (Queens / "Meowdoku" style), but with dachshunds. It's a single self-contained `index.html` with no build step and no dependencies.

## Rules
- 8×8 grid split into 8 coloured territories.
- Exactly one dog per row, per column and per territory.
- Dogs can't touch each other, not even diagonally.
- Tap / left-click marks ✕. Double-tap / right-click places a dog.
- A wrong dog costs a ❤. You have 3.

Every generated puzzle has exactly one solution, and you can reach it by logic alone, with no guessing.

## Play locally
Open `index.html` in any modern browser.

## Share a puzzle
Add `#<number>-<easy|medium|hard>` to the URL to open a specific puzzle, e.g. `index.html#123456-hard`.
