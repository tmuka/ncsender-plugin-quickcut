A test build of QuickCut from the fork's `combined/0.1.23`: Francis's unreleased full-size redesign plus the fixes and features in PRs #11 to #28 on siganberg/ncsender-plugin-quickcut. Not an official QuickCut release: when QuickCut's next version comes out, ncSender offers it as an update.

## 🎨 Previews
- Every shape (Circle, Polygon, Star, Slot, Arc Slot, Keyhole, Trapezoid, Triangle, Arch, Ellipse) now has the new top view: the stock, the bit's path cut as it goes, and the bit.
- The bit is drawn to scale, so a bigger bit looks bigger; a small one is still big enough to see.
- The stock that comes away has a stronger hatch.
- Holding tabs show as the part of the bit's path left standing, on every copy of a pattern, and only where the program really leaves them.

## 🧷 Holding tabs
- Tabs that the full-depth passes would cut through, or that would sit on a point, are dropped, and the program and preview say how many are left.
- No tabs on an Inside cut that clears the whole inside: there's nothing left for them to hold.

## 🔻 Chamfer
- Going to Chamfer picks a V-bit from your tool table instead of keeping the drill or end mill.
- With no V-bit picked, the note by Generate says so.
- Trapezoid, Triangle, Arch and Ellipse can be chamfered from the Rectangle card; the Edge button names the shape.

## ⚠️ Warnings
- A note by Generate when Total Depth goes deeper than the tool's flutes. It doesn't stop you.
- Rates, RPM and depth past your machine's limits are flagged.

## 🐛 Fixes
- Cutter figure: the bit runs in the waste, its edge on the cut line.
- Flutes can be typed when the tool table doesn't give the count.
- `1,000` in a field says why it isn't read.
- Label menus no longer draw a focus box over the field below.
