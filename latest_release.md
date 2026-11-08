A test build of QuickCut from the fork's `combined/0.1.23`: Francis's unreleased full-size redesign plus the fixes and features in PRs #11 to #42 on siganberg/ncsender-plugin-quickcut. Not an official QuickCut release: when QuickCut's next version comes out, ncSender offers it as an update.

## ⚡ Feeds and speeds
- Starting feeds know the depth: a compression bit in wood cuts in the fewest equal passes its flutes allow (a 1/4" one cuts 3/4" plywood in one pass), a pass deeper than the bit is wide takes a slightly thinner chip, and no starting pass goes deeper than the flutes.
- Help has a Feeds & Speeds page: the starting feeds for every bit in your tool table (or common sizes) in Conservative, Average and Aggressive, for a material and Total Depth, with what shapes them. A Print link prints just the table.

## 🧰 Tools and stock
- The tool menu lists the tools in the magazine first, by slot, with their Tool ID.
- With Spoilboard Toolbox installed and a stock thickness set there, a Stock button by Total Depth fills it in.
- The Tool column sits on the panel in the cards' colors, its titles and rows level with the cards beside it.

## 🎨 Previews
- Every shape (Circle, Polygon, Star, Slot, Arc Slot, Keyhole, Trapezoid, Triangle, Arch, Ellipse) has the new top view: the stock, the bit's path cut as it goes, and the bit, drawn to scale.
- The stock that comes away has a stronger hatch.
- Holding tabs show as the part of the bit's path left standing, on every copy of a pattern, and only where the program really leaves them.
- In a pattern, a triangle's sizes go on the copy facing open stock.

## 🧷 Holding tabs
- Tabs the full-depth passes would cut through, or that would sit on a point, are dropped, and the program and preview say how many are left.
- No tabs on an Inside cut that clears the whole inside.

## 🔻 Chamfer
- Every edge works: Holes, Circle, Rect (and its Trapezoid, Triangle, Arch and Ellipse), Polygon and Star, Slot and Arc Slot, and Keyhole.
- Keyhole: the chamfer goes round the opening at the surface. Set the Keyhole Bit and its Neck (blank: half the bit).
- Holes can be plunged: Method Plunge goes straight down at each hole's center, like a countersink. It's quicker; the V-bit has to be wider than the hole and chamfer, and the note says the largest hole it can plunge.
- Going to Chamfer picks a V-bit from your tool table (also when QuickCut reopens there), and leaves the shape's Depth of Cut alone. Generate Chamfer no longer changes the shape's own bit or cut type.
- A pattern's X / Y Gap is measured on the cut, so the bevels land in the right places (on Drill, with the Hole Diameter).
- "Chamfer these holes / this shape" carries the drill or keyhole bit's size over, and Back from Help or Measure stays on Chamfer.
- An Outside chamfer's preview keeps the stock and the cut around each part.
- Trapezoid, Triangle, Arch and Ellipse can be chamfered from the Rectangle card.

## ⚠️ Notes by Generate
- Notes that don't stop you are amber, not red: red is kept for a field to fix or a cut past the machine's travel.
- The flute note shows only when Total Depth is well past the flutes (more than 1 mm or a tenth of their length), so a through cut just past them stays quiet.
- Rates, RPM and depth past your machine's limits are flagged.

## 🐛 Fixes
- QuickCut reopens on the tab you left, not Chamfer.
- Cutter figure: the bit runs in the waste, its edge on the cut line.
- Flutes can be typed when the tool table doesn't give the count.
- `1,000` in a field says why it isn't read.
- Label menus no longer draw a focus box over the field below.
