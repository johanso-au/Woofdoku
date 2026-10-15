#!/usr/bin/env node
// Builds the 50-level ladder embedded in index.html.
//
// Uses the game's own generator (the /*GEN-START*/ ... /*GEN-END*/ section of index.html):
// for each difficulty tier it generates a pool of verified puzzles (unique solution,
// solvable by logic alone, opening that fits the tier), sorts them by solving effort,
// and spreads the tier's levels evenly across that range so difficulty climbs steadily.
// The result replaces the /*LEVELS-START*/ ... /*LEVELS-END*/ block in index.html.
//
// Usage: node tools/build-levels.js [poolSizePerTier=24]

const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '..', 'index.html');
const html = fs.readFileSync(file, 'utf8');
const src = html.split('/*GEN-START*/')[1].split('/*GEN-END*/')[0];
const G = new Function(src + '; return { TIERS, mulberry32, genSolution, pickCaps, genRegions, refineRegions, logicSolve, countSolutions, gradeSolve, shuffle };')();

const POOL = +(process.argv[2] || 24);
// Part of each tier's (effort-sorted) pool to draw from, so neighbouring tiers don't collide.
const WINDOW = { Puppy: [0, 1], Easy: [0, 1], Medium: [0, 0.85], Tricky: [0.2, 0.8], Expert: [0.3, 1] };
const lines = [];

for (const [ti, tier] of G.TIERS.entries()) {
  const rng = G.mulberry32(9001 + ti * 7919);
  const pool = [], seen = new Set();
  const size = tier.name === 'Expert' ? POOL * 2 : POOL;
  const t0 = Date.now();
  for (let t = 0; pool.length < size && t < 20000; t++) {
    const sol = G.genSolution(rng);
    const caps = G.pickCaps(tier, rng);
    const reg = G.genRegions(sol, rng, caps);
    if (!G.refineRegions(sol, reg, rng, caps)) continue;
    const res = G.logicSolve(reg, [], 4);
    if (!res.ok || G.countSolutions(reg, 2) !== 1) continue;
    const g = G.gradeSolve(res);
    if (!tier.fit(g)) continue;
    const key = Array.from(reg).join('');
    if (seen.has(key)) continue;
    seen.add(key);
    pool.push({ reg: key, sol: sol.join(''), col: G.shuffle([0, 1, 2, 3, 4, 5, 6, 7], rng).join(''), tech: g.max, effort: g.effort });
  }
  pool.sort((a, b) => a.effort - b.effort);
  const count = tier.to - tier.from + 1;
  const [w0, w1] = WINDOW[tier.name] || [0, 1];
  const lo = Math.floor(w0 * (pool.length - 1)), hi = Math.ceil(w1 * (pool.length - 1));
  // spread levels evenly across the window (pool is sorted, so effort rises within the tier;
  // each new tier adds a harder kind of deduction)
  for (let k = 0; k < count; k++) {
    const idx = Math.round(lo + (k / Math.max(1, count - 1)) * (hi - lo));
    const p = pool[idx];
    lines.push(`  '${p.reg}|${p.sol}|${p.col}|${p.tech}|${p.effort}', // ${tier.from + k} ${tier.name}`);
  }
  console.log(`${tier.name}: pool ${pool.length}, effort ${pool[0].effort}..${pool[pool.length - 1].effort}, ${((Date.now() - t0) / 1000).toFixed(1)}s`);
}

const block = `/*LEVELS-START*/\nconst LEVELS = [\n${lines.join('\n')}\n];\n/*LEVELS-END*/`;
const out = html.replace(/\/\*LEVELS-START\*\/[\s\S]*?\/\*LEVELS-END\*\//, block);
fs.writeFileSync(file, out);
console.log(`Wrote ${lines.length} levels to index.html`);
