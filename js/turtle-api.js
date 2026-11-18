// Turtle commands for completion, parameter hints and hover help.
// params: [name, short help]. snippet: text to insert ($1 = first stop).

export const TURTLE_API = [
  { name: "forward", params: [["distance", "how many steps"]], doc: "Move forward. The pen draws a line if it is down.", snippet: "forward(${1:50})" },
  { name: "backward", params: [["distance", "how many steps"]], doc: "Move back. The turtle keeps facing the same way.", snippet: "backward(${1:50})" },
  { name: "left", params: [["angle", "degrees to turn"]], doc: "Turn left (counterclockwise). 90 is a quarter turn.", snippet: "left(${1:90})" },
  { name: "right", params: [["angle", "degrees to turn"]], doc: "Turn right (clockwise). 90 is a quarter turn.", snippet: "right(${1:90})" },
  { name: "circle", params: [["radius", "size of the circle"], ["extent", "optional: degrees of the circle to draw"]], doc: "Draw a circle. The center is on the turtle's left.", snippet: "circle(${1:50})" },
  { name: "penup", params: [], doc: "Lift the pen. The turtle moves but does not draw.", snippet: "penup()" },
  { name: "pendown", params: [], doc: "Put the pen down. The turtle draws when it moves.", snippet: "pendown()" },
  { name: "color", params: [["color", "a name like \"red\" or a code like \"#ff0000\""]], doc: "Set the pen color and the fill color.", snippet: "color(\"${1:red}\")" },
  { name: "pensize", params: [["width", "line width"]], doc: "Set how thick the lines are.", snippet: "pensize(${1:3})" },
  { name: "setposition", params: [["x", "left (-) or right (+)"], ["y", "down (-) or up (+)"]], doc: "Move to a spot. The center is (0, 0).", snippet: "setposition(${1:0}, ${2:0})" },
  { name: "goto", params: [["x", "left (-) or right (+)"], ["y", "down (-) or up (+)"]], doc: "Move to a spot. The center is (0, 0).", snippet: "goto(${1:0}, ${2:0})" },
  { name: "setheading", params: [["angle", "0 = right, 90 = up, 180 = left, 270 = down"]], doc: "Face a direction.", snippet: "setheading(${1:90})" },
  { name: "begin_fill", params: [], doc: "Start a shape to fill. Call end_fill() after the shape.", snippet: "begin_fill()" },
  { name: "end_fill", params: [], doc: "Fill the shape since begin_fill() with the fill color.", snippet: "end_fill()" },
  { name: "dot", params: [["size", "how big"], ["color", "optional color"]], doc: "Draw a dot at the turtle.", snippet: "dot(${1:10})" },
  { name: "write", params: [["text", "words to write"]], doc: "Write text at the turtle.", snippet: "write(\"${1:hello}\")" },
  { name: "speed", params: [["speed", "ignored here"]], doc: "This site ignores speed(). Use the speed menu.", snippet: "speed(${1:0})" },
  { name: "hideturtle", params: [], doc: "Hide the turtle.", snippet: "hideturtle()" },
  { name: "showturtle", params: [], doc: "Show the turtle.", snippet: "showturtle()" },
  { name: "clear", params: [], doc: "Erase what this turtle drew.", snippet: "clear()" },
  { name: "home", params: [], doc: "Go back to (0, 0) and face right.", snippet: "home()" },
  { name: "xcor", params: [], doc: "Give back the x position.", snippet: "xcor()" },
  { name: "ycor", params: [], doc: "Give back the y position.", snippet: "ycor()" },
  { name: "heading", params: [], doc: "Give back the direction in degrees.", snippet: "heading()" },
];

// Not turtle methods: only at the top level.
export const GLOBAL_ONLY = [
  { name: "bgcolor", params: [["color", "a color name"]], doc: "Set the background color.", snippet: "bgcolor(\"${1:lightblue}\")" },
  { name: "Turtle", params: [], doc: "Make a new turtle. Example: bob = Turtle()", snippet: "Turtle()" },
];

export const PY_BUILTINS = [
  { name: "print", params: [["value", "what to show"]], doc: "Show a value in the output box.", snippet: "print(${1})" },
  { name: "range", params: [["n", "count from 0 up to n - 1"]], doc: "Numbers 0, 1, 2, ... n - 1. Use it in a for loop.", snippet: "range(${1:4})" },
  { name: "len", params: [["thing", "a list or a string"]], doc: "How many items.", snippet: "len(${1})" },
  { name: "input", params: [["question", "text to ask"]], doc: "Ask a question (not ready yet on this site).", snippet: "input(\"${1}\")" },
];

export const PY_SNIPPETS = [
  { label: "for loop", insert: "for ${1:i} in range(${2:4}):\n\t$0", doc: "Repeat the indented lines." },
  { label: "def function", insert: "def ${1:name}(${2}):\n\t$0", doc: "Make your own command." },
  { label: "if", insert: "if ${1:x > 0}:\n\t$0", doc: "Run the indented lines only if the test is True." },
  { label: "if else", insert: "if ${1:x > 0}:\n\t${2:pass}\nelse:\n\t$0", doc: "Pick one of two paths." },
  { label: "while loop", insert: "while ${1:x < 10}:\n\t$0", doc: "Repeat while the test is True." },
];

export const PY_KEYWORDS = ["for", "in", "range", "def", "return", "if", "elif", "else", "while",
  "True", "False", "None", "and", "or", "not", "pass", "break", "continue", "import", "from"];

export const API_BY_NAME = Object.fromEntries([...TURTLE_API, ...GLOBAL_ONLY, ...PY_BUILTINS].map((f) => [f.name, f]));
