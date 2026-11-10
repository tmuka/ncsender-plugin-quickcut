// Concentric Copies: copies of a shape stepping inside or outside it.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { makeQuickCutGenerator } = require('../lib/quickcut-gcode.cjs');

const gen = makeQuickCutGenerator(false);
const common = {
  origin: 'center', bitDiameter: 3, depth: 2, depthOfCut: 1,
  feedRate: 800, plungeFeedRate: 200, spindleRpm: 15000, spindleDelay: 0, mistM7: false, floodM8: false
};
const concentric = (o) => ({ enabled: true, copies: 3, direction: 'inside', stepMode: 'distance', step: 25, spacing: 'offset', shiftX: 0, shiftY: 0, turn: 0, ...o });
const near = (a, b, msg) => assert.ok(Math.abs(a - b) < 1e-6, `${msg}: ${a} vs ${b}`);
const plan = (p, shape) => gen.concentricPlan(p, shape, gen.concentricFits(shape));

test('circle: inside copies 25 apart, smallest first, the shape last', () => {
  const p = { ...common, diameter: 200, cutType: 'inner', concentric: concentric() };
  const list = plan(p, 'circle').list;
  assert.deepEqual(list.map(e => e.params.diameter), [50, 100, 150, 200]);
  assert.deepEqual(list.map(e => e.k), [3, 2, 1, 0]);
  const g = gen.generateCircleProgram(p);
  // Each one starts at its rightmost point less the bit's radius.
  const starts = g.split('\n').filter(l => /^G0 X\S+ Y0\.000$/.test(l)).map(l => parseFloat(l.slice(4)));
  assert.deepEqual(starts, [23.5, 48.5, 73.5, 98.5]);
  assert.match(g, /\(Concentric copies: 3 inside, 25mm apart, offset\)/);
  assert.deepEqual(g.match(/^\((Concentric copy \d|The shape): cut \d of 4\)$/gm), ['(Concentric copy 3: cut 1 of 4)', '(Concentric copy 2: cut 2 of 4)', '(Concentric copy 1: cut 3 of 4)', '(The shape: cut 4 of 4)']);
});

test('outside copies cut outward, the shape first', () => {
  const list = plan({ ...common, diameter: 20, cutType: 'outer', concentric: concentric({ direction: 'outside', step: 5 }) }, 'circle').list;
  assert.deepEqual(list.map(e => e.params.diameter), [20, 30, 40, 50]);
});

test('copies too small for the bit are left out and the header says so', () => {
  const p = { ...common, diameter: 60, cutType: 'inner', concentric: concentric({ step: 20 }) };
  const pl = plan(p, 'circle');
  assert.deepEqual(pl.list.map(e => e.params.diameter), [20, 60]);
  assert.equal(pl.skipped, 2);
  assert.match(gen.generateCircleProgram(p), /\(Concentric copies: 1 inside, 20mm apart, offset\)\n\(Concentric copies too small, left out: 2\)/);
});

test('rectangle offset: sides move, corners round outward and stay sharp inward', () => {
  const out = plan({ ...common, width: 50, height: 30, cornerRadius: 0, cutType: 'outer', concentric: concentric({ direction: 'outside', step: 5, copies: 2 }) }, 'rectangle').list;
  assert.deepEqual(out.map(e => [e.params.width, e.params.height, e.params.cornerRadius]), [[50, 30, 0], [60, 40, 5], [70, 50, 10]]);
  const ins = plan({ ...common, width: 50, height: 30, cornerRadius: 4, cutType: 'inner', concentric: concentric({ step: 5, copies: 2 }) }, 'rectangle').list;
  assert.deepEqual(ins.map(e => [e.params.width, e.params.height, e.params.cornerRadius]), [[30, 10, 0], [40, 20, 0], [50, 30, 4]]);
});

test('rectangle scale: the same shape, its longer half side the step less', () => {
  const list = plan({ ...common, width: 100, height: 50, cornerRadius: 10, cutType: 'outer', concentric: concentric({ step: 10, copies: 1, spacing: 'scale' }) }, 'rectangle').list;
  const e = list[0].params;
  near(e.width, 80, 'width'); near(e.height, 40, 'height'); near(e.cornerRadius, 8, 'corner');
});

test('ratio: each copy a share of the last, inside or outside', () => {
  const ins = plan({ ...common, diameter: 80, cutType: 'outer', concentric: concentric({ stepMode: 'ratio', step: 50, copies: 2 }) }, 'circle').list;
  assert.deepEqual(ins.map(e => e.params.diameter), [20, 40, 80]);
  const outs = plan({ ...common, diameter: 80, cutType: 'outer', concentric: concentric({ stepMode: 'ratio', step: 50, copies: 2, direction: 'outside' }) }, 'circle').list;
  assert.deepEqual(outs.map(e => e.params.diameter), [80, 160, 320]);
});

test('polygon offset moves its flats and rounds its corners', () => {
  const n = 6, R = 20, d = 4;
  const list = plan({ ...common, sides: n, radius: R, diameter: 2 * R, cornerRadius: 0, cutType: 'outer', concentric: concentric({ direction: 'outside', step: d, copies: 1 }) }, 'polygon').list;
  const e = list[1].params;
  near(e.radius * Math.cos(Math.PI / n), R * Math.cos(Math.PI / n) + d, 'apothem');
  near(e.cornerRadius, d, 'corner radius');
  assert.match(gen.generatePolygonProgram({ ...common, sides: n, radius: R, diameter: 2 * R, cutType: 'outer', concentric: concentric({ direction: 'outside', step: d, copies: 1 }) }), /\(Concentric copy 1: cut 2 of 2\)/);
});

test('star offset keeps its shape: every edge moves the step', () => {
  const p = { ...common, kind: 'star', sides: 5, diameter: 100, innerDiameter: 38.2, cutType: 'outer', concentric: concentric({ step: 5, copies: 1 }) };
  const e = plan(p, 'star').list[0].params;
  near(e.innerDiameter / e.diameter, 38.2 / 100, 'ratio kept');
  // The edge lines' distance from the center drops by 5.
  const h = (q) => { const v = gen.starVertices(q), a = v[0], b = v[1]; return Math.abs(a.x * b.y - a.y * b.x) / Math.hypot(b.x - a.x, b.y - a.y); };
  near(h(p) - h(e), 5, 'edge distance');
  assert.match(gen.generatePolygonProgram(p), /\(Concentric copy 1: cut 1 of 2\)/);
});

test('shift and turn grow with each copy', () => {
  const list = plan({ ...common, width: 60, height: 60, cutType: 'outer', concentric: concentric({ step: 5, copies: 2, shiftX: 2, shiftY: -1, turn: 15 }) }, 'rectangle').list;
  assert.deepEqual(list.map(e => [e.k, e.dx, e.dy, e.turn]), [[2, 4, -2, 30], [1, 2, -1, 15], [0, 0, 0, 0]]);
});

test('off, or no copies: the program is the shape alone', () => {
  const base = { ...common, diameter: 50, cutType: 'inner' };
  assert.equal(gen.generateCircleProgram({ ...base, concentric: concentric({ enabled: false }) }), gen.generateCircleProgram(base));
  assert.equal(gen.generateCircleProgram({ ...base, concentric: concentric({ copies: 0 }) }), gen.generateCircleProgram(base));
});

test('the origin is a corner of the shape and its concentric together', () => {
  // A 100 x 50 part from its front-left corner with 3 outside concentric copies 10
  // apart: nothing goes past X0 Y0 but the bit's radius.
  const xs = [], ys = [];
  gen.generateRectangleProgram({ ...common, width: 100, height: 50, cutType: 'outer', origin: 'front-left',
    concentric: concentric({ direction: 'outside', step: 10 }) }).split('\n').forEach(l => {
    const x = /X(-?[\d.]+)/.exec(l), y = /Y(-?[\d.]+)/.exec(l);
    if (/^G[0-3] /.test(l) && x) xs.push(+x[1]);
    if (/^G[0-3] /.test(l) && y) ys.push(+y[1]);
  });
  near(Math.min(...xs), -1.5, 'min X');
  near(Math.min(...ys), -1.5, 'min Y');
  near(Math.max(...xs), 160 + 1.5, 'max X');
});
