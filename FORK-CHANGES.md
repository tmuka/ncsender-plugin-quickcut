# Changes on this fork, ready to pick

Each change is its own branch on [tmuka/ncsender-plugin-quickcut](https://github.com/tmuka/ncsender-plugin-quickcut),
made from siganberg's `main` at **0fd08fe** (Planer/Jointer/Rectangle redesign). Every branch stands alone: take a
whole branch (`git merge`) or single commits (`git cherry-pick`), in any order. `combined/0.1.23` merges them all for
testing on a machine; nothing is committed there directly except this file.

```
git remote add tmuka https://github.com/tmuka/ncsender-plugin-quickcut.git
git fetch tmuka
git merge tmuka/fork/cutter-bit-in-waste        # a whole change
git cherry-pick 1e4960d                          # or one commit
```

| Branch | Commits | What it does |
| --- | --- | --- |
| `fork/cutter-bit-in-waste` | 1e4960d | Cutter figure: the bit ran centred on the cut line, half of it in the part kept. Its centre now runs one radius into the waste (edge on the line, as the program cuts) and the kerf is the bit's width. |
| `fork/label-menu-focus` | 7c28219, c611503 | Label menus (Material · Aggressive...) lose ncSender's focus box over the field below; the label lights up instead. Esc in the tool menu closes the menu, not QuickCut. |
| `fork/flutes-no-table-info` | d52a7b8 | Tool Library mode hides Flutes; it now shows when the picked tool has no `metadata.flutes`, so the count can be typed. |
| `fork/spindle-delay-394` | fac5ac2, fca221f | When the controller's `$394` (spindle at-speed delay) waits, Spindle Delay hides and the program writes no G4 after M3 (a comment says the controller waits). |
| `fork/field-errors` | 3ddf2ef, b7c6957, 8cc1736, aecfe53, c942e75 | Unit fields say why `1,000` is refused (ncsender-unit-input 0.1.4); field errors show after a second's pause instead of mid-typing; a tool picked from the table refills the starting feeds; rates, RPM and depth past the machine's limits are flagged, naming the lower limit. |
| `fork/drill-tip-through` | 30ee46f, ebb1592 | Drill: Total Depth's label is a menu, Total Depth / Drill Tip Through. Drill Tip Through adds the point's length (bit / 2 / tan(tip angle / 2)) so the full diameter reaches the depth; Tip Angle filled from a picked drill (ball 90, flat 180). Feed Rate is hidden on Drill (every move is a plunge), shown when chamfering. |

**Tests:** each branch passes `npm test` on its own. One test, "the ncsender-unit-input copy in config.html matches the
library", compares with a sibling `../ncsender-unit-input` checkout: it fails on any branch without `fork/field-errors`
when that checkout is newer than 0.1.3 (main fails it too then). Generator changes are in both `lib/quickcut-gcode.cjs`
and config.html's copy; the two give the same programs (3500 compared).

**Combining:** `fork/drill-tip-through` touches the same lines as `fork/field-errors` (the tool pick in `pickBitTool`)
and `fork/spindle-delay-394` (tests added at the end of `tests/quickcut-gcode.test.cjs`): keep both sides.

**On a machine:** all of them were in the Pi test builds 0.1.23-test.9 to test.12 (ncSender Pro, grblHAL, RapidChange
ATC) and checked in the dialog; none is confirmed by a real cut yet.

## Open on siganberg/ncsender-plugin-quickcut

These have PRs upstream (made from `main` at 0fd08fe too) and are merged into `combined/0.1.23`. #19 to #23 are
stacked: each builds on the one before.

| PR | Branch | What it does |
| --- | --- | --- |
| #11 | `fix/cutter-bit-in-waste` | Same as `fork/cutter-bit-in-waste`. |
| #12 | `fix/flutes-no-table-info` | Same as `fork/flutes-no-table-info`. |
| #13 | `fix/unit-comma-message` | Unit fields say why `1,000` is refused. |
| #14 | `fix/machine-limits` | Rates, RPM and depth past the machine's limits are flagged. |
| #15 | `fix/label-menu-focus` | Same as `fork/label-menu-focus`. |
| #16 | `fix/tab-markers` | Previews draw holding tabs as the stretch of the bit's path they leave standing. |
| #17 | `fix/tabs-nothing-to-hold` | No tabs on an Inside cut that clears the whole inside. |
| #18 | `fix/tabs-fit-edges` | Tabs the full-depth passes would cut through, or left on a point, are dropped, with a warning. |
| #19 | `feat/new-preview-rect-kinds` | The new top view (stock, animated bit path, the bit) for Trapezoid, Triangle, Arch and Ellipse, through one shared renderer. |
| #20 | `feat/new-preview-circle` | Circle in the new top view. |
| #21 | `feat/new-preview-polygon` | Polygon and Star in the new top view. |
| #22 | `feat/new-preview-slot` | Slot and Arc Slot in the new top view. |
| #23 | `feat/new-preview-keyhole` | Keyhole in the new top view. |
| #24 | `fix/hatch-contrast` | A stronger hatch on the stock that comes away. |
| #25 | `fix/preview-bit-size` | The bit drawn to scale (a small one still big enough to see), its cut off the edge; Inset label size. |
| #26 | `fix/chamfer-rect-kind` | Chamfer's Rect edge names the Rectangle card's shape, and a menu picks it. |
| #27 | `feat/flute-depth-note` | A note by Generate when Total Depth goes past the tool's flutes. |
| #28 | `fix/chamfer-vbit` | Chamfer picks a V-bit from the tool table, warns when the bit isn't one, and leaves the shape's Depth of Cut alone. |

**Fixes on `combined/0.1.23` only** (from a review of the merge, not yet in a PR): previews draw a pattern's tabs on
each copy, follow arcs, and leave out the tabs the program drops; the side view only says tabs hold the part when
some are cut.
