// Turn a Python error into short words for a child.
// kidError(err, names) -> { text, raw }. names: known names for "did you mean".
import { API_BY_NAME, PY_KEYWORDS, COLORS } from "./turtle-api.js";

function distance(a, b) {
  const d = Array.from({ length: a.length + 1 }, (_, i) => [i]);
  for (let j = 1; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    }
  }
  return d[a.length][b.length];
}

// The closest known name, if it is close enough to be a typo.
function closest(word, names) {
  let best = null, bestD = Infinity;
  for (const n of names) { const d = distance(word, n); if (d < bestD) { best = n; bestD = d; } }
  return bestD <= Math.max(2, Math.floor(word.length / 3)) ? best : null; // 2: swapped letters, "bleu"
}

export function didYouMean(word, names = []) {
  const all = new Set([...Object.keys(API_BY_NAME), ...PY_KEYWORDS, ...names]);
  let best = null, bestD = Infinity;
  for (const n of all) {
    if (n === word) continue;
    const d = n.toLowerCase() === word.toLowerCase() ? 0.5 : distance(word, n);
    if (d < bestD) { best = n; bestD = d; }
  }
  return bestD <= Math.max(1, Math.floor(word.length / 3)) ? best : null;
}

const RULES = [
  [/^NameError$/, /name '(\w+)' is not defined/, (m, names) => {
    const guess = didYouMean(m[1], names);
    return `Python does not know the name "${m[1]}".` + (guess ? ` Did you mean "${guess}"?` : " Check the spelling, or make it first.");
  }],
  [/^SyntaxError$/, /expected ':'/, () => "This line must end with a colon (:). Lines that start a loop, a function or an if need one."],
  [/^SyntaxError$/, /'\(' was never closed|unexpected EOF|was never closed/, () => "A ( has no ). Every ( needs a ) to close it."],
  [/^SyntaxError$/, /unterminated string/, () => "Text in quotes must start and end with the same quote mark: \"red\"."],
  [/^SyntaxError$/, /invalid syntax\. Perhaps you forgot a comma/, () => "Put a comma between the values: goto(10, 20)."],
  [/^SyntaxError$/, /cannot assign to function call|Maybe you meant '=='/, () => "Use == to compare two values. Use = only to put a value in a box."],
  [/^SyntaxError$/, /.*/, () => "Python cannot read this line. Look for a missing colon, quote mark or ( )."],
  [/^IndentationError$/, /expected an indented block/, () => "The lines after this one must move in by 4 spaces. They are the inside of the loop, function or if."],
  [/^IndentationError$/, /unexpected indent/, () => "This line moves in, but it must not. Line it up with the line above."],
  [/^(IndentationError|TabError)$/, /.*/, () => "The spaces at the start of this line do not match the lines around it."],
  [/^TypeError$/, /(\w+)\(\) missing (\d+) required positional argument/, (m) => `${m[1]} needs ${m[2] === "1" ? "a value" : m[2] + " values"} in the ( ). Example: ${m[1]}(50)`],
  [/^TypeError$/, /(\w+)\(\) takes (\d+) positional arguments? but (\d+) (?:was|were) given/, (m) => `${m[1]} takes ${m[2]} value${m[2] === "1" ? "" : "s"} in the ( ), but it got ${m[3]}.`],
  [/^TypeError$/, /(\w+) needs a number, but got (.*)/, (m) => `${m[1]} needs a number, but it got ${m[2]}. Numbers have no quote marks: ${m[1]}(50).`],
  [/^TypeError$/, /can only concatenate str|unsupported operand type/, () => "You cannot add text and a number. Use str(n) to make the number into text."],
  [/^TypeError$/, /'(\w+)' object is not callable/, (m) => `A ${m[1]} is not a command. Do not put ( ) after it.`],
  [/^ValueError$/, /bad color: (.*)/, (m) => {
    const guess = closest(m[1].toLowerCase(), Object.keys(COLORS));
    return `"${m[1]}" is not a color.` + (guess ? ` Did you mean "${guess}"?` : ' Try a name like "red" or "blue".');
  }],
  [/^ZeroDivisionError$/, /.*/, () => "You cannot divide by zero."],
  [/^IndexError$/, /.*/, () => "The list has no item at that number. The first item is number 0."],
  [/^StepLimit$/, /.*/, () => "The program ran too many steps. A loop never ends? Check the test of your while loop."],
  [/^Timeout$/, /.*/, () => "The program ran too long, so it was stopped."],
  [/^RecursionError$/, /.*/, () => "A function calls itself with no end."],
  [/^AttributeError$/, /object has no attribute '(\w+)'/, (m) => {
    const guess = didYouMean(m[1]);
    return `A turtle has no command "${m[1]}".` + (guess ? ` Did you mean "${guess}"?` : "");
  }],
];

export function kidError(err, names = []) {
  const raw = `${err.type}: ${err.msg}`;
  for (const [type, msg, fn] of RULES) {
    if (!type.test(err.type)) continue;
    const m = err.msg.match(msg);
    if (m) return { text: fn(m, names), raw };
  }
  return { text: raw, raw };
}
