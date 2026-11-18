// Lesson content. Format: src/md/features/lessons.md (Lesson file).
// The body is JSON: test/test_lessons.py reads it with json.
export const LESSONS = [
  {
    "id": "calls-1",
    "unit": 1,
    "title": "First steps",
    "concept": "A program is steps in order",
    "text": "Python runs your lines from top to bottom. `forward(100)` moves the turtle.",
    "task": "Draw a line 100 steps long.",
    "starter": "# Move the turtle\n",
    "solution": "forward(100)\n",
    "hints": [
      "Use `forward(100)`."
    ],
    "example": "forward(50)\nleft(90)\nforward(50)\n",
    "objects": false
  },
  {
    "id": "calls-2",
    "unit": 1,
    "title": "Turn",
    "concept": "A function call has an argument",
    "text": "The number in the brackets is the argument. `left(90)` turns the turtle 90 degrees.",
    "task": "Draw a corner: 100 steps, a left turn, then 50 steps.",
    "starter": "forward(100)\n",
    "solution": "forward(100)\nleft(90)\nforward(50)\n",
    "hints": [
      "Add `left(90)` after the first line.",
      "Then add `forward(50)`."
    ],
    "example": "forward(30)\nleft(45)\nforward(30)\nright(90)\nforward(30)\n",
    "objects": false
  },
  {
    "id": "errors-1",
    "unit": 2,
    "title": "Fix a name",
    "concept": "Read an error",
    "text": "An error tells you the line and the problem. Read it, then fix the line.",
    "task": "Run the code. Fix the error so the turtle draws the corner.",
    "starter": "forward(100)\nleft(90)\nfowrard(100)\n",
    "solution": "forward(100)\nleft(90)\nforward(100)\n",
    "hints": [
      "Look at line 3.",
      "Check the spelling of `forward`."
    ],
    "example": "forward(60)\nleft(90)\nforward(60)\n",
    "objects": false
  },
  {
    "id": "errors-2",
    "unit": 2,
    "title": "Fix a bracket",
    "concept": "Each bracket needs a partner",
    "text": "Each `(` needs a `)`. Python stops if one is missing.",
    "task": "Fix the error so the turtle draws the corner.",
    "starter": "forward(80\nleft(90)\nforward(80)\n",
    "solution": "forward(80)\nleft(90)\nforward(80)\n",
    "hints": [
      "Look at line 1.",
      "Add `)` at the end of line 1."
    ],
    "example": "forward(40)\nleft(90)\nforward(40)\n",
    "objects": false
  },
  {
    "id": "comments-1",
    "unit": 3,
    "title": "Steps",
    "concept": "Comments and the order of steps",
    "text": "A line that starts with `#` is a comment. Python does not run it. The order of lines changes the drawing.",
    "task": "Draw two stair steps. Each step goes up 40, then right 40.",
    "starter": "# Step 1\nleft(90)\nforward(40)\nright(90)\nforward(40)\n# Step 2\n",
    "solution": "# Step 1\nleft(90)\nforward(40)\nright(90)\nforward(40)\n# Step 2\nleft(90)\nforward(40)\nright(90)\nforward(40)\n",
    "hints": [
      "Copy the 4 lines of step 1 under `# Step 2`."
    ],
    "example": "# Up\nleft(90)\nforward(30)\n# Right\nright(90)\nforward(30)\n",
    "objects": false
  },
  {
    "id": "variables-1",
    "unit": 4,
    "title": "Variables",
    "concept": "A variable is a box with a name",
    "text": "Put a value in a box with `=`. Then use the name.",
    "task": "Draw the square. Put the side length in a box named `size`.",
    "starter": "size = 100\nforward(size)\nleft(90)\nforward(size)\nleft(90)\n",
    "solution": "size = 100\nforward(size)\nleft(90)\nforward(size)\nleft(90)\nforward(size)\nleft(90)\nforward(size)\nleft(90)\n",
    "hints": [
      "A square has 4 sides.",
      "Add two more `forward(size)` and `left(90)` pairs."
    ],
    "example": "size = 30\nforward(size)\nsize = 60\nforward(size)\n",
    "objects": false
  },
  {
    "id": "variables-2",
    "unit": 4,
    "title": "Box math",
    "concept": "Change a variable. Do math.",
    "text": "You can do math with a box: `height = width / 2`. You can give a box a new value.",
    "task": "Draw a rectangle 120 wide and half as tall. Use `width` and `height`.",
    "starter": "width = 120\nheight = 0\n",
    "solution": "width = 120\nheight = width / 2\nforward(width)\nleft(90)\nforward(height)\nleft(90)\nforward(width)\nleft(90)\nforward(height)\nleft(90)\n",
    "hints": [
      "Set `height = width / 2`.",
      "Go width, turn, height, turn, two times."
    ],
    "example": "step = 20\nforward(step)\nstep = step * 2\nleft(90)\nforward(step)\n",
    "objects": false
  },
  {
    "id": "types-1",
    "unit": 5,
    "title": "Numbers and text",
    "concept": "Types: numbers and strings",
    "text": "`50` is a number. `\"50\"` is text (a string). `int(\"50\")` makes a number from text. `print` shows a value.",
    "task": "Make `side` a number from the text, print it, and draw a corner with it.",
    "starter": "text = \"80\"\nside = text\nprint(side)\n",
    "solution": "text = \"80\"\nside = int(text)\nprint(\"side is\", side)\nforward(side)\nleft(90)\nforward(side)\n",
    "hints": [
      "`forward` needs a number, not text.",
      "Use `int(text)`."
    ],
    "example": "a = 5\nb = \"5\"\nprint(a + a)\nprint(b + b)\n",
    "objects": false
  },
  {
    "id": "loops-1",
    "unit": 6,
    "title": "Triangle",
    "concept": "A loop repeats lines",
    "text": "A `for` loop runs the lines inside it many times. The inside lines have 4 spaces in front.",
    "task": "Draw a triangle with sides of 80.",
    "starter": "for i in range(3):\n    forward(80)\n",
    "solution": "for i in range(3):\n    forward(80)\n    left(120)\n",
    "hints": [
      "Turn 120 degrees each time."
    ],
    "example": "for i in range(4):\n    forward(40)\n    left(90)\n",
    "objects": false
  },
  {
    "id": "loops-2",
    "unit": 6,
    "title": "Many sides",
    "concept": "The loop count and the turn",
    "text": "`range(6)` runs the loop 6 times. The turns of a shape add up to 360.",
    "task": "Draw a hexagon (6 sides) with sides of 50.",
    "starter": "for i in range(6):\n    forward(50)\n    left(90)\n",
    "solution": "for i in range(6):\n    forward(50)\n    left(60)\n",
    "hints": [
      "360 / 6 = 60."
    ],
    "example": "for i in range(5):\n    forward(40)\n    left(72)\n",
    "objects": false
  },
  {
    "id": "loops-3",
    "unit": 6,
    "title": "Squares in a row",
    "concept": "A loop in a loop",
    "text": "A loop can be inside a loop. The inside loop runs fully each round.",
    "task": "Draw 3 squares of 40 in a row.",
    "starter": "for n in range(3):\n    # draw a square here\n    forward(40)\n",
    "solution": "for n in range(3):\n    for i in range(4):\n        forward(40)\n        left(90)\n    forward(40)\n",
    "hints": [
      "Put a square loop inside the first loop.",
      "After each square, move forward 40."
    ],
    "example": "for n in range(2):\n    for i in range(3):\n        forward(30)\n        left(120)\n    forward(40)\n",
    "objects": false
  },
  {
    "id": "functions-1",
    "unit": 7,
    "title": "Your own command",
    "concept": "Define a function, then call it",
    "text": "`def` makes a new command. Python does not run it until you call it.",
    "task": "Make `square()` and call it two times. Turn 180 between the calls.",
    "starter": "def square():\n    for i in range(4):\n        forward(50)\n        left(90)\n\n",
    "solution": "def square():\n    for i in range(4):\n        forward(50)\n        left(90)\n\nsquare()\nleft(180)\nsquare()\n",
    "hints": [
      "Call it with `square()`.",
      "Then `left(180)` and `square()` again."
    ],
    "example": "def corner():\n    forward(30)\n    left(90)\n\ncorner()\ncorner()\n",
    "objects": false
  },
  {
    "id": "functions-2",
    "unit": 7,
    "title": "Parameters",
    "concept": "A parameter is a box for the argument",
    "text": "`def square(size):` takes a value. Each call can give a different value.",
    "task": "Draw a square of 40 and a square of 80 with one function.",
    "starter": "def square(size):\n    for i in range(4):\n        forward(50)\n        left(90)\n\nsquare(40)\n",
    "solution": "def square(size):\n    for i in range(4):\n        forward(size)\n        left(90)\n\nsquare(40)\nsquare(80)\n",
    "hints": [
      "Use `size` in place of `50`.",
      "Add `square(80)`."
    ],
    "example": "def line(length):\n    forward(length)\n    left(90)\n\nline(20)\nline(40)\n",
    "objects": false
  },
  {
    "id": "functions-3",
    "unit": 7,
    "title": "Give back",
    "concept": "A function can return a value",
    "text": "`return` gives a value back to the caller.",
    "task": "Make `double(n)` return `n * 2`. Draw a corner with sides of `double(40)`.",
    "starter": "def double(n):\n    return n\n\nside = double(40)\nforward(side)\nleft(90)\nforward(side)\n",
    "solution": "def double(n):\n    return n * 2\n\nside = double(40)\nforward(side)\nleft(90)\nforward(side)\n",
    "hints": [
      "Change `return n` to `return n * 2`."
    ],
    "example": "def half(n):\n    return n / 2\n\nforward(half(100))\n",
    "objects": false
  },
  {
    "id": "if-1",
    "unit": 8,
    "title": "Dashes",
    "concept": "if and else",
    "text": "`if` runs lines only when a test is True. `else` runs when it is False.",
    "task": "Draw a dashed line: pen down on even rounds, pen up on odd rounds.",
    "starter": "for i in range(6):\n    forward(20)\n",
    "solution": "for i in range(6):\n    if i % 2 == 0:\n        pendown()\n    else:\n        penup()\n    forward(20)\n",
    "hints": [
      "`i % 2 == 0` is True for 0, 2, 4.",
      "Use `pendown()` and `penup()`."
    ],
    "example": "x = 3\nif x > 2:\n    forward(40)\nelse:\n    left(90)\n",
    "objects": false
  },
  {
    "id": "if-2",
    "unit": 8,
    "title": "Big or small",
    "concept": "Comparisons and booleans",
    "text": "`True` and `False` are booleans. `<`, `>` and `==` give a boolean.",
    "task": "If `big` is True, draw a square of 100. Else draw a triangle of 50.",
    "starter": "big = True\n",
    "solution": "big = True\nif big:\n    for i in range(4):\n        forward(100)\n        left(90)\nelse:\n    for i in range(3):\n        forward(50)\n        left(120)\n",
    "hints": [
      "Start with `if big:`.",
      "Put the square loop under `if` and the triangle loop under `else`."
    ],
    "example": "size = 30\nprint(size > 20)\nprint(size == 20)\n",
    "objects": false
  },
  {
    "id": "while-1",
    "unit": 9,
    "title": "Spiral",
    "concept": "A while loop runs while a test is True",
    "text": "`while` repeats until the test is False. Change a box in the loop, or it never stops.",
    "task": "Draw a square spiral: start at 10, add 10 each time, stop after 100.",
    "starter": "side = 10\nwhile side <= 100:\n    forward(side)\n    left(90)\n",
    "solution": "side = 10\nwhile side <= 100:\n    forward(side)\n    left(90)\n    side = side + 10\n",
    "hints": [
      "The starter never stops. Make `side` bigger in the loop.",
      "Add `side = side + 10`."
    ],
    "example": "n = 0\nwhile n < 3:\n    forward(30)\n    left(120)\n    n = n + 1\n",
    "objects": false
  },
  {
    "id": "lists-1",
    "unit": 10,
    "title": "A list",
    "concept": "A list holds many values",
    "text": "A list is `[30, 60, 90]`. A `for` loop can go over each value.",
    "task": "Draw one line for each size in the list, with a left turn of 90 after each.",
    "starter": "sizes = [30, 60, 90, 120]\n",
    "solution": "sizes = [30, 60, 90, 120]\nfor s in sizes:\n    forward(s)\n    left(90)\n",
    "hints": [
      "Use `for s in sizes:`."
    ],
    "example": "names = [\"red\", \"blue\"]\nfor n in names:\n    print(n)\n",
    "objects": false
  },
  {
    "id": "lists-2",
    "unit": 10,
    "title": "Bar chart",
    "concept": "Loop over a list of data",
    "text": "Each value in the list can make one part of the drawing.",
    "task": "Draw a bar chart with bars 40, 80 and 60 high and 20 wide.",
    "starter": "heights = [40, 80, 60]\nfor h in heights:\n    left(90)\n    forward(h)\n",
    "solution": "heights = [40, 80, 60]\nfor h in heights:\n    left(90)\n    forward(h)\n    right(90)\n    forward(20)\n    right(90)\n    forward(h)\n    left(90)\n",
    "hints": [
      "Each bar: up h, right 20, down h.",
      "Turn so the turtle faces right again at the end."
    ],
    "example": "data = [20, 40]\nfor d in data:\n    forward(d)\n    left(90)\n    forward(10)\n    left(90)\n",
    "objects": false
  },
  {
    "id": "objects-1",
    "unit": 11,
    "title": "Name your turtle",
    "concept": "An object: Turtle()",
    "text": "`tracy = Turtle()` makes a turtle named `tracy`. Then `tracy.forward(50)` moves it.",
    "task": "Make `tracy` and draw a square of 80 with her.",
    "starter": "tracy = Turtle()\n",
    "solution": "tracy = Turtle()\nfor i in range(4):\n    tracy.forward(80)\n    tracy.left(90)\n",
    "hints": [
      "Put `tracy.` in front of each command."
    ],
    "example": "tracy = Turtle()\ntracy.forward(60)\ntracy.left(90)\ntracy.forward(30)\n",
    "objects": true
  },
  {
    "id": "objects-2",
    "unit": 11,
    "title": "Two turtles",
    "concept": "More than one object",
    "text": "Each turtle is its own object. Each one has its own place and pen.",
    "task": "Make `tracy` and `bob`. Tracy draws 100 to the right. Bob turns around and draws 100 to the left.",
    "starter": "tracy = Turtle()\nbob = Turtle()\ntracy.forward(100)\n",
    "solution": "tracy = Turtle()\nbob = Turtle()\ntracy.forward(100)\nbob.left(180)\nbob.forward(100)\n",
    "hints": [
      "Bob needs `bob.left(180)` first."
    ],
    "example": "tracy = Turtle()\nbob = Turtle()\ntracy.forward(40)\nbob.left(90)\nbob.forward(40)\n",
    "objects": true
  },
  {
    "id": "project-house",
    "unit": 12,
    "title": "House",
    "concept": "Project: put it all together",
    "text": "Use a function for each part. Call them in order.",
    "task": "Draw a house: a square of 100 with a triangle roof of 100 on top.",
    "starter": "tracy = Turtle()\n\ndef wall():\n    pass\n\ndef roof():\n    pass\n\nwall()\nroof()\n",
    "solution": "tracy = Turtle()\n\ndef wall():\n    for i in range(4):\n        tracy.forward(100)\n        tracy.left(90)\n\ndef roof():\n    tracy.left(90)\n    tracy.forward(100)\n    tracy.right(90)\n    for i in range(3):\n        tracy.forward(100)\n        tracy.left(120)\n\nwall()\nroof()\n",
    "hints": [
      "`wall()` is a square loop.",
      "For the roof, go up 100 first, then draw a triangle."
    ],
    "example": "tracy = Turtle()\n\ndef door():\n    for i in range(2):\n        tracy.forward(20)\n        tracy.left(90)\n        tracy.forward(40)\n        tracy.left(90)\n\ndoor()\n",
    "objects": true
  },
  {
    "id": "project-flower",
    "unit": 12,
    "title": "Flower",
    "concept": "Project: loops and circles",
    "text": "`tracy.circle(40)` draws a circle. Turn a bit after each one.",
    "task": "Draw a flower: 6 circles of 40, with a left turn of 60 after each.",
    "starter": "tracy = Turtle()\ntracy.circle(40)\n",
    "solution": "tracy = Turtle()\nfor i in range(6):\n    tracy.circle(40)\n    tracy.left(60)\n",
    "hints": [
      "Use `for i in range(6):`.",
      "360 / 6 = 60."
    ],
    "example": "tracy = Turtle()\ntracy.circle(30)\ntracy.left(90)\ntracy.circle(30)\n",
    "objects": true
  },
  {
    "id": "project-spiral",
    "unit": 12,
    "title": "Spiral",
    "concept": "Project: a loop with a growing box",
    "text": "A box that grows each round makes a spiral.",
    "task": "Draw a spiral: 30 lines, start at 5, add 5 each time, turn 91 each time.",
    "starter": "tracy = Turtle()\nside = 5\n",
    "solution": "tracy = Turtle()\nside = 5\nfor i in range(30):\n    tracy.forward(side)\n    tracy.left(91)\n    side = side + 5\n",
    "hints": [
      "Use `for i in range(30):`.",
      "Add 5 to `side` in the loop."
    ],
    "example": "tracy = Turtle()\nside = 10\nfor i in range(8):\n    tracy.forward(side)\n    tracy.left(120)\n    side = side + 10\n",
    "objects": true
  }
];
