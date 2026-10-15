# 🌭 Woofdoku

**A cosy logic puzzle about finding every dachshund the perfect spot.**

### ▶️ [Play Woofdoku](https://johanso-au.github.io/Woofdoku/)

It runs in any modern browser on phone, tablet or desktop. There's nothing to install and no account to make.

---

## Where the idea comes from

Woofdoku is a twist on **Queens**-style puzzles. Those puzzles grew out of the pen-and-paper genre **Star Battle** and the classic **eight queens problem** from chess. In Star Battle you place stars on a grid split into irregular regions, so that each row, column and region holds the same number of stars and no two stars touch. Queens puzzles take the one-star version of that idea. It also echoes the old chess challenge of placing eight queens so that none attack each other.

Woofdoku keeps that logic and swaps the queens for cartoon dachshunds:

| Queens-style puzzle | Woofdoku |
|---|---|
| Place a queen in every row and column | Place a **dog** in every row and column |
| One queen per coloured region | One dog per coloured **territory** |
| Queens can't touch, even diagonally | Dogs need room to stretch, so they can't touch either |

On top of that core it adds hearts, explaining hints, 50 levels of rising difficulty, an endless mode, scores and badges.

---

## How to play

The board is an **8×8 grid** split into **8 coloured territories**. Place **8 dogs** so that:

1. every **row** has exactly one dog,
2. every **column** has exactly one dog,
3. every **territory** has exactly one dog, and
4. no two dogs **touch**, not even diagonally.

Every puzzle has **exactly one solution**, and you can always reach it by logic alone. You never need to guess.

### Controls

| Action | Touch | Mouse / keyboard |
|---|---|---|
| Mark a square ✕ | Tap | Left-click · <kbd>X</kbd> / <kbd>Space</kbd> |
| Mark many squares | Swipe across them | Click and drag |
| Erase many ✕s | Swipe starting on an ✕ | Drag starting on an ✕ |
| Place a dog | Double-tap | Right-click · <kbd>D</kbd> / <kbd>Enter</kbd> |
| Undo | **Undo** button | <kbd>Z</kbd> |
| Hint | **Hint** button | <kbd>H</kbd> |
| Move the cursor | | Arrow keys |

You can also switch **"Tap places"** to *Dog* if you'd rather single-tap to place dogs.

Placing a dog in the wrong square costs a ❤. You have three, and each wrong square can only cost you once.

---

## Features

- **50 levels in five tiers**: Puppy, Easy, Medium, Tricky and Expert. Early levels open with a one-square territory, so the first dog is a gimme. Later ones need "what if" reasoning and pair deductions. Difficulty climbs steadily within each tier.
- **♾️ Endless mode**: freshly generated puzzles that ramp from Easy up to Expert. Hearts carry over between puzzles, a flawless solve wins one back, and the run ends when you're out of hearts.
- **Hints that teach.** A hint works from your current board and shows the next logical step right on the grid. It outlines the territory, row or column involved, hatches the squares a dog would block, and places a see-through "ghost" dog for "what if" steps. It then explains in plain words, by colour, why the step works.
- **Scoring**: a level bonus, a speed bonus against par time, a tidiness bonus (fewer ✕ marks is better, and none at all is a big bonus), points for hearts left, and a penalty for hints. Each solve earns 1–3 ⭐.
- **High scores**: your best score on every level, a top-10 table, and your best Endless runs.
- **21 badges**, such as *Speedy Sausage* (under a minute), *Clean Paws* (no ✕s), *Lucky Guess*, *Hot Dog Streak*, *Off the Leash* and *Top Dog*.
- **Built-in art and sound**: the dachshund is hand-drawn SVG, and every bark and chime is synthesised live with the Web Audio API. There are no image or audio files.
- **Works on phones and desktops**, with large tap targets, reduced-motion support and keyboard play.

---

## Your data stays on your device

Progress, scores, badges and games in progress are saved in your browser's **localStorage**, on your device only. The game makes **no network requests**, so nothing is uploaded, tracked or shared.

A few things follow from that:

- Each browser and device keeps its own progress.
- Clearing your browser's site data erases your progress, and so does **Reset all progress** on the Scores screen.
- Safari on iPhone may clear data for a website you haven't visited in about a week. Adding Woofdoku to your Home Screen avoids this.

---

## Running it yourself

The whole game is one self-contained file, [`index.html`](index.html), with no build step and no dependencies.

- **Play locally:** download `index.html` and open it in a browser.
- **Host it:** serve the file from any static host. The live version uses GitHub Pages from the `main` branch.

### Project layout

```
index.html               the entire game: markup, styles, art, sound, generator and UI
tools/build-levels.js    rebuilds the 50-level ladder embedded in index.html
README.md                this file
```

---

## How the puzzles are made

The generator lives inside `index.html`, between the `/*GEN-START*/` and `/*GEN-END*/` markers.

1. **Pick a solution.** Place 8 dogs with one per row and column and none touching.
2. **Grow territories.** Grow 8 connected territories outward from those dogs. Each tier can cap some territories at small sizes, such as one square for the easy opening.
3. **Make the solution unique.** Random territories almost never have only one answer. So the generator repeatedly finds a rival solution, then shifts squares between neighbouring territories (keeping every territory connected) until only one answer remains. A brute-force counter double-checks the result.
4. **Prove it's solvable by logic.** A human-style solver works through the puzzle using only these deductions:
   - one free square left in a row, column or territory;
   - a territory that fits inside a single line;
   - "what if" eliminations;
   - pairs and triples of territories confined to the same lines.

   If the solver finishes, the puzzle needs no guessing. The hardest step it needed, and the hardest step before the first dog, set the puzzle's difficulty.
5. **Build the ladder.** [`tools/build-levels.js`](tools/build-levels.js) generates a pool of puzzles for each tier, sorts them by solving effort and embeds an evenly spaced ladder of 50 levels in `index.html`. Endless mode uses the same generator in a background Web Worker, preparing the next puzzle while you play the current one.

To regenerate the levels (requires [Node.js](https://nodejs.org/)):

```
node tools/build-levels.js
```

---

Made with 🐾 for puzzle lovers and sausage-dog fans.
