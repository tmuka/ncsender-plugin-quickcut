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
