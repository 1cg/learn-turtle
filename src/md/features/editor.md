# Editor

The editor is Monaco (`js/editor.js`). The command list for completion and hover help is in `js/turtle-api.js`.

## Completion

The rule: completion helps the child find a name. It never fills in a value for the child.

- The list opens after 2 letters. After a dot (`bob.`) it opens at once.
- Match from the start of the word only. "bo" shows `bob`, not `bgcolor`.
- If the typed word is already a full function or variable name, the list closes. Then Enter makes a new line.
- Tab or Enter accepts.
- A function goes in as the name and empty brackets, with the cursor inside: `forward()`. No sample value.
- If a `(` already comes after the word, only the name goes in.
- A block (`for`, `def`, `if`, `while`) goes in with empty blanks: `for i in range():`.
- The list also has the child's own names: functions, variables and loop variables. It skips the line that the child types on.
- No grey preview of the item in the code.

## Grey words

Empty brackets show the names of the values they need, in faint italic: `forward(distance)`. This is not code. It goes away when the child types in the brackets. Optional values do not show. A hover on the brackets gives the help text.

There is no hint box that pops up while the child types. The grey words are enough, and they are calmer (the human chose this).

## Colors

- Inside the quotes of `color`, `pencolor`, `fillcolor`, `bgcolor` and the color of `dot`, the list shows 16 common colors with a swatch each.
- `color` goes in as `color("")` and opens the color list.
- No grey words in empty quotes, and no swatch in the code (the human found both confusing).
- Any CSS color name works, not only the 16. A bad name stops the run: `"purpel" is not a color. Did you mean "purple"?`

## Quiet screen

These Monaco features are off, because a beginner does not need them:
- highlight of other copies of the word at the cursor, and of the selected text;
- bracket colors, bracket match highlight and bracket guides.
