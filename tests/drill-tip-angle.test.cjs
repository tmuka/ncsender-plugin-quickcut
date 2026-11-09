// drillTipAngle and vBitOf in config.html: what a tool picked from the table
// says about its point and whether it's a V-bit.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const html = fs.readFileSync(path.join(__dirname, '..', 'config.html'), 'utf8');
function fn(name) {
  const start = html.indexOf('  function ' + name + '(');
  assert.ok(start >= 0, name + ' not found in config.html');
  const end = html.indexOf('\n  }\n', start);
  return html.slice(start, end + 4);
}
const ctx = {};
vm.createContext(ctx);
vm.runInContext([fn('vBitAngle'), fn('vBitOf'), fn('drillTipAngle'), 'this.drillTipAngle = drillTipAngle; this.vBitOf = vBitOf;'].join('\n'), ctx);

// SpeTool W01015 as the Fusion 360 importer saves it (ncSender#111)
const W01015 = { name: 'SpeTool W01015 1/32" Radius Tapered Ball Nose', type: 'tapered-ball', diameter: 1.5875,
  dimensions: { radius: 0.79375, taper_angle: 5.38, flute_length: 25.4, shank_diameter: 6.35 } };

test('a tapered ball nose has a 90° point, like a ball nose', () => {
  assert.equal(ctx.drillTipAngle(W01015), 90);
  assert.equal(ctx.drillTipAngle({ name: '1/4" Ball', type: 'ball', diameter: 6.35 }), 90);
  // Its taper is per side of a round tip, not a drill's point or a V
  assert.equal(ctx.vBitOf(W01015), null);
});

test('the other types are as before', () => {
  assert.equal(ctx.drillTipAngle({ name: '1/4" Drill', type: 'drill', diameter: 6.35 }), 118);
  assert.equal(ctx.drillTipAngle({ name: 'Spot', type: 'drill', diameter: 6, dimensions: { taper_angle: 45 } }), 90);
  assert.equal(ctx.drillTipAngle({ name: '1/4" Flat', type: 'flat', diameter: 6.35 }), 180);
  assert.equal(ctx.drillTipAngle({ name: '60° V-bit', type: 'v-bit', diameter: 12.7 }), null);
});

test('a bull nose or bowl bit: the point that reaches full width at its corner radius', () => {
  // SpeTool W08002 bowl and tray bit: 3/4" across, 1/4" corners: 2 atan(1.5) = 112.6°
  const bowl = { name: '3/4" Bowl & Tray', type: 'bull-nose', diameter: 19.05, dimensions: { radius: 6.35 } };
  assert.equal(ctx.drillTipAngle(bowl), 112.6);
  // Corners of half the diameter are a ball; none is flat
  assert.equal(ctx.drillTipAngle({ type: 'bull-nose', diameter: 6, dimensions: { radius: 3 } }), 90);
  assert.equal(ctx.drillTipAngle({ type: 'bull-nose', diameter: 6, dimensions: { radius: 5 } }), 90);
  assert.equal(ctx.drillTipAngle({ type: 'bull-nose', diameter: 6 }), 180);
  assert.equal(ctx.vBitOf(bowl), null);
});
