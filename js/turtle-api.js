// Turtle commands for completion, parameter hints and hover help.
// params: [name, short help]. A help text that starts with "optional" gets no grey word.

export const TURTLE_API = [
  { name: "forward", params: [["distance", "how many steps"]], doc: "Move forward. The pen draws a line if it is down." },
  { name: "backward", params: [["distance", "how many steps"]], doc: "Move back. The turtle keeps facing the same way." },
  { name: "left", params: [["angle", "degrees to turn"]], doc: "Turn left (counterclockwise). 90 is a quarter turn." },
  { name: "right", params: [["angle", "degrees to turn"]], doc: "Turn right (clockwise). 90 is a quarter turn." },
  { name: "circle", params: [["radius", "size of the circle"], ["extent", "optional: degrees of the circle to draw"]], doc: "Draw a circle. The center is on the turtle's left." },
  { name: "penup", params: [], doc: "Lift the pen. The turtle moves but does not draw." },
  { name: "pendown", params: [], doc: "Put the pen down. The turtle draws when it moves." },
  { name: "color", params: [["color", "a name like \"red\" or a code like \"#ff0000\""]], doc: "Set the pen color and the fill color." },
  { name: "pensize", params: [["width", "line width"]], doc: "Set how thick the lines are." },
  { name: "setposition", params: [["x", "left (-) or right (+)"], ["y", "down (-) or up (+)"]], doc: "Move to a spot. The center is (0, 0)." },
  { name: "goto", params: [["x", "left (-) or right (+)"], ["y", "down (-) or up (+)"]], doc: "Move to a spot. The center is (0, 0)." },
  { name: "setheading", params: [["angle", "0 = right, 90 = up, 180 = left, 270 = down"]], doc: "Face a direction." },
  { name: "begin_fill", params: [], doc: "Start a shape to fill. Call end_fill() after the shape." },
  { name: "end_fill", params: [], doc: "Fill the shape since begin_fill() with the fill color." },
  { name: "dot", params: [["size", "how big"], ["color", "optional color"]], doc: "Draw a dot at the turtle." },
  { name: "write", params: [["text", "words to write"]], doc: "Write text at the turtle." },
  { name: "speed", params: [["speed", "ignored here"]], doc: "This site ignores speed(). Use the speed menu." },
  { name: "hideturtle", params: [], doc: "Hide the turtle." },
  { name: "showturtle", params: [], doc: "Show the turtle." },
  { name: "clear", params: [], doc: "Erase what this turtle drew." },
  { name: "home", params: [], doc: "Go back to (0, 0) and face right." },
  { name: "xcor", params: [], doc: "Give back the x position." },
  { name: "ycor", params: [], doc: "Give back the y position." },
  { name: "heading", params: [], doc: "Give back the direction in degrees." },
];

// Not turtle methods: only at the top level.
export const GLOBAL_ONLY = [
  { name: "bgcolor", params: [["color", "a color name"]], doc: "Set the background color." },
  { name: "Turtle", params: [], doc: "Make a new turtle. Example: bob = Turtle()" },
];

export const PY_BUILTINS = [
  { name: "print", params: [["value", "what to show"]], doc: "Show a value in the output box." },
  { name: "range", params: [["n", "count from 0 up to n - 1"]], doc: "Numbers 0, 1, 2, ... n - 1. Use it in a for loop." },
  { name: "len", params: [["thing", "a list or a string"]], doc: "How many items." },
  { name: "input", params: [["question", "text to ask"]], doc: "Ask a question (not ready yet on this site)." },
];

// Blocks go in with empty blanks: the child fills them in.
export const PY_SNIPPETS = [
  { label: "for loop", insert: "for i in range($1):\n\t$0", doc: "Repeat the indented lines." },
  { label: "def function", insert: "def $1($2):\n\t$0", doc: "Make your own command." },
  { label: "if", insert: "if $1:\n\t$0", doc: "Run the indented lines only if the test is True." },
  { label: "if else", insert: "if $1:\n\t$2\nelse:\n\t$0", doc: "Pick one of two paths." },
  { label: "while loop", insert: "while $1:\n\t$0", doc: "Repeat while the test is True." },
];

// The color list, in rainbow order. Any CSS color name works in the code.
export const COLORS = { red: "#ff0000", orange: "#ffa500", yellow: "#ffff00", gold: "#ffd700", lime: "#00ff00", green: "#008000",
  cyan: "#00ffff", blue: "#0000ff", navy: "#000080", purple: "#800080", magenta: "#ff00ff", pink: "#ffc0cb",
  brown: "#a52a2a", gray: "#808080", black: "#000000", white: "#ffffff" };

// Calls that take a color in quotes.
export const COLOR_FNS = ["color", "pencolor", "fillcolor", "bgcolor"];

export const PY_KEYWORDS = ["for", "in", "range", "def", "return", "if", "elif", "else", "while",
  "True", "False", "None", "and", "or", "not", "pass", "break", "continue", "import", "from"];

export const API_BY_NAME = Object.fromEntries([...TURTLE_API, ...GLOBAL_ONLY, ...PY_BUILTINS].map((f) => [f.name, f]));
