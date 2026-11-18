// Lesson content. Format: src/md/features/lessons.md (Lesson format).
// The body is JSON: test/test_lessons.py reads it with json.
export const LESSONS = [
  {
    "id": "calls-1",
    "unit": 1,
    "title": "First steps",
    "concept": "A program is steps in order",
    "objects": false,
    "steps": [
      {
        "kind": "watch",
        "text": "Python runs your lines from top to bottom. `forward(50)` moves the turtle.",
        "look": "Look for: how far does the turtle move?",
        "code": "forward(50)\n"
      },
      {
        "kind": "try",
        "text": "Change the number to change the length.",
        "task": "Make the line 100 steps long.",
        "solution": "forward(100)\n",
        "hints": [
          "Change `50` to `100`."
        ]
      },
      {
        "kind": "extend",
        "text": "Add more lines under your line.",
        "task": "Add a turn and a second line: `left(90)`, then 50 steps.",
        "solution": "forward(100)\nleft(90)\nforward(50)\n",
        "hints": [
          "Add `left(90)`.",
          "Then add `forward(50)`."
        ]
      }
    ]
  },
  {
    "id": "calls-2",
    "unit": 1,
    "title": "Turn",
    "concept": "A function call has an argument",
    "objects": false,
    "steps": [
      {
        "kind": "watch",
        "text": "The number in the brackets is the argument. `left(90)` turns the turtle 90 degrees.",
        "look": "Look for: which line turns the turtle, and which way?",
        "code": "forward(60)\nleft(90)\nforward(60)\n"
      },
      {
        "kind": "try",
        "text": "`right` turns the other way.",
        "task": "Make the turtle turn right, not left.",
        "solution": "forward(60)\nright(90)\nforward(60)\n",
        "hints": [
          "Change `left` to `right`."
        ]
      },
      {
        "kind": "extend",
        "text": "Each turn and line adds a side.",
        "task": "Add one more right turn and line, to draw 3 sides of a square.",
        "solution": "forward(60)\nright(90)\nforward(60)\nright(90)\nforward(60)\n",
        "hints": [
          "Add `right(90)` and `forward(60)`."
        ]
      }
    ]
  },
  {
    "id": "errors-1",
    "unit": 2,
    "title": "Fix a name",
    "concept": "Read an error",
    "objects": false,
    "steps": [
      {
        "kind": "watch",
        "text": "This program has an error. The error tells you the line and the problem.",
        "look": "Look for: which line has the error? What does the message say?",
        "code": "forward(100)\nleft(90)\nfowrard(100)\n",
        "expectError": true
      },
      {
        "kind": "try",
        "text": "Fix the line that the error names.",
        "task": "Fix the error so the turtle draws the corner.",
        "solution": "forward(100)\nleft(90)\nforward(100)\n",
        "hints": [
          "Look at line 3.",
          "Check the spelling of `forward`."
        ]
      },
      {
        "kind": "extend",
        "text": "Now the program runs. Add to it.",
        "task": "Add a third side: turn left 90 and go 100.",
        "solution": "forward(100)\nleft(90)\nforward(100)\nleft(90)\nforward(100)\n",
        "hints": [
          "Add `left(90)` and `forward(100)`."
        ]
      }
    ]
  },
  {
    "id": "errors-2",
    "unit": 2,
    "title": "Fix a bracket",
    "concept": "Each bracket needs a partner",
    "objects": false,
    "steps": [
      {
        "kind": "watch",
        "text": "Each `(` needs a `)`. Python stops if one is missing.",
        "look": "Look for: where does Python say the problem is?",
        "code": "forward(80\nleft(90)\nforward(80)\n",
        "expectError": true
      },
      {
        "kind": "try",
        "text": "Add the missing bracket.",
        "task": "Fix the error so the turtle draws the corner.",
        "solution": "forward(80)\nleft(90)\nforward(80)\n",
        "hints": [
          "Look at line 1.",
          "Add `)` at the end of line 1."
        ]
      },
      {
        "kind": "extend",
        "text": "Now the program runs. Add to it.",
        "task": "Close the triangle: turn left 135 and go 113.",
        "solution": "forward(80)\nleft(90)\nforward(80)\nleft(135)\nforward(113)\n",
        "hints": [
          "Add `left(135)`.",
          "Then `forward(113)`."
        ]
      }
    ]
  },
  {
    "id": "comments-1",
    "unit": 3,
    "title": "Steps",
    "concept": "Comments and the order of steps",
    "objects": false,
    "steps": [
      {
        "kind": "watch",
        "text": "A line that starts with `#` is a comment. Python does not run it.",
        "look": "Look for: which lines does Python skip?",
        "code": "# Up\nleft(90)\nforward(40)\n# Right\nright(90)\nforward(40)\n"
      },
      {
        "kind": "try",
        "text": "The order of lines makes the drawing.",
        "task": "Add a second stair step under the first one: up 40, right 40.",
        "solution": "# Up\nleft(90)\nforward(40)\n# Right\nright(90)\nforward(40)\n# Up\nleft(90)\nforward(40)\n# Right\nright(90)\nforward(40)\n",
        "hints": [
          "Copy the 6 lines and put the copy at the end."
        ]
      },
      {
        "kind": "extend",
        "text": "Comments help you find each part.",
        "task": "Add a third step.",
        "solution": "# Up\nleft(90)\nforward(40)\n# Right\nright(90)\nforward(40)\n# Up\nleft(90)\nforward(40)\n# Right\nright(90)\nforward(40)\n# Up\nleft(90)\nforward(40)\n# Right\nright(90)\nforward(40)\n",
        "hints": [
          "Copy one step again."
        ]
      }
    ]
  },
  {
    "id": "variables-1",
    "unit": 4,
    "title": "Variables",
    "concept": "A variable is a box with a name",
    "objects": false,
    "steps": [
      {
        "kind": "watch",
        "text": "`size = 50` puts 50 in a box named `size`. Then `forward(size)` uses it.",
        "look": "Look for: where does the program use the value in `size`?",
        "code": "size = 50\nforward(size)\nleft(90)\nforward(size)\n"
      },
      {
        "kind": "try",
        "text": "A square has 4 sides.",
        "task": "Finish the square: add two more sides with `forward(size)`.",
        "solution": "size = 50\nforward(size)\nleft(90)\nforward(size)\nleft(90)\nforward(size)\nleft(90)\nforward(size)\n",
        "hints": [
          "Add `left(90)` and `forward(size)` two times."
        ]
      },
      {
        "kind": "extend",
        "text": "Change the box, and all sides change.",
        "task": "Make the square 100 big. Change only one line.",
        "solution": "size = 100\nforward(size)\nleft(90)\nforward(size)\nleft(90)\nforward(size)\nleft(90)\nforward(size)\n",
        "hints": [
          "Change the first line."
        ]
      }
    ]
  },
  {
    "id": "variables-2",
    "unit": 4,
    "title": "Box math",
    "concept": "Change a variable. Do math.",
    "objects": false,
    "steps": [
      {
        "kind": "watch",
        "text": "You can do math with a box and put the result back in the box.",
        "look": "Look for: what is in `step` after line 3?",
        "code": "step = 20\nforward(step)\nstep = step * 2\nleft(90)\nforward(step)\n"
      },
      {
        "kind": "try",
        "text": "`*` multiplies.",
        "task": "Make the second line 3 times as long as the first.",
        "solution": "step = 20\nforward(step)\nstep = step * 3\nleft(90)\nforward(step)\n",
        "hints": [
          "Change `* 2` to `* 3`."
        ]
      },
      {
        "kind": "extend",
        "text": "Do it again for one more line.",
        "task": "Add a third line, 3 times longer again, after a left turn.",
        "solution": "step = 20\nforward(step)\nstep = step * 3\nleft(90)\nforward(step)\nstep = step * 3\nleft(90)\nforward(step)\n",
        "hints": [
          "Copy the last 3 lines."
        ]
      }
    ]
  },
  {
    "id": "types-1",
    "unit": 5,
    "title": "Numbers and text",
    "concept": "Types: numbers and strings",
    "objects": false,
    "steps": [
      {
        "kind": "watch",
        "text": "`\"50\"` is text (a string). `int(text)` makes a number from it. `print` shows a value.",
        "look": "Look for: what does `print` show? Why is it not 5050?",
        "code": "text = \"50\"\nside = int(text)\nprint(side + side)\nforward(side)\n"
      },
      {
        "kind": "try",
        "text": "Change the text, and the number changes.",
        "task": "Make the text `\"80\"`. Add a left turn of 90 and a second line of `side`.",
        "solution": "text = \"80\"\nside = int(text)\nprint(side + side)\nforward(side)\nleft(90)\nforward(side)\n",
        "hints": [
          "Change `\"50\"` to `\"80\"`.",
          "Add `left(90)` and `forward(side)`."
        ]
      },
      {
        "kind": "extend",
        "text": "`print` can show text and a number.",
        "task": "Print `\"side is\"` and `side`. Then finish the square.",
        "solution": "text = \"80\"\nside = int(text)\nprint(\"side is\", side)\nforward(side)\nleft(90)\nforward(side)\nleft(90)\nforward(side)\nleft(90)\nforward(side)\n",
        "hints": [
          "Use `print(\"side is\", side)`.",
          "Add two more turns and sides."
        ]
      }
    ]
  },
  {
    "id": "loops-1",
    "unit": 6,
    "title": "Triangle",
    "concept": "A loop repeats lines",
    "objects": false,
    "steps": [
      {
        "kind": "watch",
        "text": "A `for` loop runs the lines inside it many times. The inside lines have 4 spaces in front.",
        "look": "Look for: which lines run 4 times? Which line runs only once?",
        "code": "for i in range(4):\n    forward(40)\n    left(90)\n"
      },
      {
        "kind": "try",
        "text": "The number in `range` and the turn make the shape.",
        "task": "Change the program so it draws a triangle with sides of 80.",
        "solution": "for i in range(3):\n    forward(80)\n    left(120)\n",
        "hints": [
          "3 sides.",
          "Turn 120 each time."
        ]
      },
      {
        "kind": "extend",
        "text": "Lines after the loop run after all rounds.",
        "task": "Draw a second triangle next to the first: after the loop, go forward 80 and draw it again.",
        "solution": "for i in range(3):\n    forward(80)\n    left(120)\nforward(80)\nfor i in range(3):\n    forward(80)\n    left(120)\n",
        "hints": [
          "Copy the loop under `forward(80)`."
        ]
      }
    ]
  },
  {
    "id": "loops-2",
    "unit": 6,
    "title": "Many sides",
    "concept": "The loop count and the turn",
    "objects": false,
    "steps": [
      {
        "kind": "watch",
        "text": "The turns of a closed shape add up to 360.",
        "look": "Look for: how many times does the loop run? What is 5 x 72?",
        "code": "for i in range(5):\n    forward(40)\n    left(72)\n"
      },
      {
        "kind": "try",
        "text": "360 / sides = turn.",
        "task": "Draw a hexagon (6 sides) with sides of 50.",
        "solution": "for i in range(6):\n    forward(50)\n    left(60)\n",
        "hints": [
          "360 / 6 = 60."
        ]
      },
      {
        "kind": "extend",
        "text": "A second loop draws a second shape.",
        "task": "After the hexagon, add a loop that draws an octagon (8 sides) of 40.",
        "solution": "for i in range(6):\n    forward(50)\n    left(60)\nfor i in range(8):\n    forward(40)\n    left(45)\n",
        "hints": [
          "360 / 8 = 45."
        ]
      }
    ]
  },
  {
    "id": "loops-3",
    "unit": 6,
    "title": "Shapes in a row",
    "concept": "A loop in a loop",
    "objects": false,
    "steps": [
      {
        "kind": "watch",
        "text": "A loop can be inside a loop. The inside loop runs fully each round.",
        "look": "Look for: how many times does `forward(30)` run in all?",
        "code": "for n in range(2):\n    for i in range(3):\n        forward(30)\n        left(120)\n    forward(40)\n"
      },
      {
        "kind": "try",
        "text": "Change the inside loop and the outside loop.",
        "task": "Draw 3 squares of 40 in a row.",
        "solution": "for n in range(3):\n    for i in range(4):\n        forward(40)\n        left(90)\n    forward(40)\n",
        "hints": [
          "The outside loop runs 3 times.",
          "The inside loop draws a square."
        ]
      },
      {
        "kind": "extend",
        "text": "Only one number changes the count.",
        "task": "Draw 4 squares in the row.",
        "solution": "for n in range(4):\n    for i in range(4):\n        forward(40)\n        left(90)\n    forward(40)\n",
        "hints": [
          "Change `range(3)` to `range(4)`."
        ]
      }
    ]
  },
  {
    "id": "functions-1",
    "unit": 7,
    "title": "Your own command",
    "concept": "Define a function, then call it",
    "objects": false,
    "steps": [
      {
        "kind": "watch",
        "text": "`def` makes a new command. Python does not run it until you call it.",
        "look": "Look for: does line 2 run at `def`, or at the call?",
        "code": "def corner():\n    forward(50)\n    left(90)\n\ncorner()\ncorner()\n"
      },
      {
        "kind": "try",
        "text": "Each call runs the whole function.",
        "task": "Call `corner()` two more times to close the square.",
        "solution": "def corner():\n    forward(50)\n    left(90)\n\ncorner()\ncorner()\ncorner()\ncorner()\n",
        "hints": [
          "Add `corner()` two times."
        ]
      },
      {
        "kind": "extend",
        "text": "A function can call a function.",
        "task": "Put the 4 calls in a new function `square()`. Call `square()`, turn 180, call `square()` again.",
        "solution": "def corner():\n    forward(50)\n    left(90)\n\ndef square():\n    for i in range(4):\n        corner()\n\nsquare()\nleft(180)\nsquare()\n",
        "hints": [
          "`def square():` then a loop with `corner()`.",
          "Then `square()`, `left(180)`, `square()`."
        ]
      }
    ]
  },
  {
    "id": "functions-2",
    "unit": 7,
    "title": "Parameters",
    "concept": "A parameter is a box for the argument",
    "objects": false,
    "steps": [
      {
        "kind": "watch",
        "text": "`def line(length):` takes a value. Each call can give a different value.",
        "look": "Look for: what is in `length` at each call?",
        "code": "def line(length):\n    forward(length)\n    left(90)\n\nline(20)\nline(40)\n"
      },
      {
        "kind": "try",
        "text": "Each call can use a new number.",
        "task": "Add `line(60)` and `line(80)` to make a spiral.",
        "solution": "def line(length):\n    forward(length)\n    left(90)\n\nline(20)\nline(40)\nline(60)\nline(80)\n",
        "hints": [
          "Add two calls."
        ]
      },
      {
        "kind": "extend",
        "text": "A loop can make the calls.",
        "task": "Draw 8 lines: 20, 40, up to 160. Use a loop and `line(n * 20)`.",
        "solution": "def line(length):\n    forward(length)\n    left(90)\n\nfor n in range(1, 9):\n    line(n * 20)\n",
        "hints": [
          "`for n in range(1, 9):`",
          "Call `line(n * 20)` in the loop."
        ]
      }
    ]
  },
  {
    "id": "functions-3",
    "unit": 7,
    "title": "Give back",
    "concept": "A function can return a value",
    "objects": false,
    "steps": [
      {
        "kind": "watch",
        "text": "`return` gives a value back to the caller.",
        "look": "Look for: what does `half(100)` give back?",
        "code": "def half(n):\n    return n / 2\n\nforward(half(100))\n"
      },
      {
        "kind": "try",
        "text": "Make a second function like `half`.",
        "task": "Add `double(n)` that returns `n * 2`. Then turn left 90 and go `forward(double(40))`.",
        "solution": "def half(n):\n    return n / 2\n\ndef double(n):\n    return n * 2\n\nforward(half(100))\nleft(90)\nforward(double(40))\n",
        "hints": [
          "Copy `half` and change it.",
          "Add `left(90)` and `forward(double(40))`."
        ]
      },
      {
        "kind": "extend",
        "text": "You can put a call inside a call.",
        "task": "Turn left 90 again and go `forward(half(double(60)))`.",
        "solution": "def half(n):\n    return n / 2\n\ndef double(n):\n    return n * 2\n\nforward(half(100))\nleft(90)\nforward(double(40))\nleft(90)\nforward(half(double(60)))\n",
        "hints": [
          "`double(60)` runs first."
        ]
      }
    ]
  },
  {
    "id": "if-1",
    "unit": 8,
    "title": "Dashes",
    "concept": "if and else",
    "objects": false,
    "steps": [
      {
        "kind": "watch",
        "text": "`if` runs lines only when a test is True. `else` runs when it is False.",
        "look": "Look for: in which round is the pen up?",
        "code": "for i in range(4):\n    if i == 2:\n        penup()\n    else:\n        pendown()\n    forward(20)\n"
      },
      {
        "kind": "try",
        "text": "`i % 2 == 0` is True for 0, 2, 4.",
        "task": "Make a dashed line of 6 parts: pen down when `i % 2 == 0`, else pen up.",
        "solution": "for i in range(6):\n    if i % 2 == 0:\n        pendown()\n    else:\n        penup()\n    forward(20)\n",
        "hints": [
          "Change `range(4)` to `range(6)`.",
          "Change the test to `i % 2 == 0` and swap the pen lines."
        ]
      },
      {
        "kind": "extend",
        "text": "Put your loop in a loop.",
        "task": "Draw a dashed square: 4 sides, each one your dashed line, with `left(90)` after each side.",
        "solution": "for side in range(4):\n    for i in range(6):\n        if i % 2 == 0:\n            pendown()\n        else:\n            penup()\n        forward(20)\n    left(90)\n",
        "hints": [
          "Put `for side in range(4):` on top.",
          "Add 4 spaces to your lines."
        ]
      }
    ]
  },
  {
    "id": "if-2",
    "unit": 8,
    "title": "Big or small",
    "concept": "Comparisons and booleans",
    "objects": false,
    "steps": [
      {
        "kind": "watch",
        "text": "`True` and `False` are booleans. `>`, `<` and `==` give a boolean.",
        "look": "Look for: what does each `print` show?",
        "code": "size = 30\nprint(size > 20)\nprint(size == 20)\n"
      },
      {
        "kind": "try",
        "text": "An `if` can use a boolean box.",
        "task": "If `big` is True, draw a square of 100. Else draw a triangle of 50.",
        "solution": "big = True\nif big:\n    for i in range(4):\n        forward(100)\n        left(90)\nelse:\n    for i in range(3):\n        forward(50)\n        left(120)\n",
        "hints": [
          "Start with `if big:`.",
          "Put the square loop under `if` and the triangle loop under `else`."
        ],
        "starter": "big = True\n"
      },
      {
        "kind": "extend",
        "text": "Change the box and test again.",
        "task": "After your `if`, set `big = False` and copy the `if` again, so both shapes draw.",
        "solution": "big = True\nif big:\n    for i in range(4):\n        forward(100)\n        left(90)\nelse:\n    for i in range(3):\n        forward(50)\n        left(120)\nbig = False\nif big:\n    for i in range(4):\n        forward(100)\n        left(90)\nelse:\n    for i in range(3):\n        forward(50)\n        left(120)\n",
        "hints": [
          "Add `big = False`.",
          "Copy the whole `if` and `else`."
        ]
      }
    ]
  },
  {
    "id": "while-1",
    "unit": 9,
    "title": "Spiral",
    "concept": "A while loop runs while a test is True",
    "objects": false,
    "steps": [
      {
        "kind": "watch",
        "text": "`while` repeats until the test is False. Change a box in the loop, or it never stops.",
        "look": "Look for: what is `n` when the loop stops?",
        "code": "n = 0\nwhile n < 3:\n    forward(30)\n    left(120)\n    n = n + 1\n"
      },
      {
        "kind": "try",
        "text": "The test can use any box.",
        "task": "Draw a square spiral: `side` starts at 10, add 10 each round, stop after 100.",
        "solution": "side = 10\nwhile side <= 100:\n    forward(side)\n    left(90)\n    side = side + 10\n",
        "hints": [
          "Use `side` in place of `n`.",
          "`while side <= 100:`"
        ]
      },
      {
        "kind": "extend",
        "text": "Change the turn to twist the spiral.",
        "task": "Turn 91 in place of 90, and stop after 150.",
        "solution": "side = 10\nwhile side <= 150:\n    forward(side)\n    left(91)\n    side = side + 10\n",
        "hints": [
          "Change `90` and `100`."
        ]
      }
    ]
  },
  {
    "id": "lists-1",
    "unit": 10,
    "title": "A list",
    "concept": "A list holds many values",
    "objects": false,
    "steps": [
      {
        "kind": "watch",
        "text": "A list is `[\"red\", \"blue\"]`. A `for` loop can go over each value.",
        "look": "Look for: how many times does the loop run? What is `n` each time?",
        "code": "names = [\"red\", \"blue\"]\nfor n in names:\n    print(n)\n"
      },
      {
        "kind": "try",
        "text": "The loop works with a list of numbers too.",
        "task": "Draw one line for each size in the list, with a left turn of 90 after each.",
        "solution": "sizes = [30, 60, 90, 120]\nfor s in sizes:\n    forward(s)\n    left(90)\n",
        "hints": [
          "Use `for s in sizes:`."
        ],
        "starter": "sizes = [30, 60, 90, 120]\n"
      },
      {
        "kind": "extend",
        "text": "Add values to the list, not lines to the loop.",
        "task": "Add 150 and 180 to the list.",
        "solution": "sizes = [30, 60, 90, 120, 150, 180]\nfor s in sizes:\n    forward(s)\n    left(90)\n",
        "hints": [
          "Put the new numbers inside `[ ]`."
        ]
      }
    ]
  },
  {
    "id": "lists-2",
    "unit": 10,
    "title": "Bar chart",
    "concept": "Loop over a list of data",
    "objects": false,
    "steps": [
      {
        "kind": "watch",
        "text": "Each value in the list can make one part of the drawing.",
        "look": "Look for: what part of the drawing does each value make?",
        "code": "data = [20, 40]\nfor d in data:\n    left(90)\n    forward(d)\n    right(90)\n    forward(10)\n    right(90)\n    forward(d)\n    left(90)\n"
      },
      {
        "kind": "try",
        "text": "Change the data and the width.",
        "task": "Draw bars 40, 80 and 60 high and 20 wide.",
        "solution": "data = [40, 80, 60]\nfor d in data:\n    left(90)\n    forward(d)\n    right(90)\n    forward(20)\n    right(90)\n    forward(d)\n    left(90)\n",
        "hints": [
          "Change the list.",
          "Change `forward(10)` to `forward(20)`."
        ]
      },
      {
        "kind": "extend",
        "text": "The loop draws as many bars as the list has.",
        "task": "Add two more bars: 100 and 20.",
        "solution": "data = [40, 80, 60, 100, 20]\nfor d in data:\n    left(90)\n    forward(d)\n    right(90)\n    forward(20)\n    right(90)\n    forward(d)\n    left(90)\n",
        "hints": [
          "Add the numbers to the list."
        ]
      }
    ]
  },
  {
    "id": "objects-1",
    "unit": 11,
    "title": "Name your turtle",
    "concept": "An object: Turtle()",
    "objects": true,
    "steps": [
      {
        "kind": "watch",
        "text": "`tracy = Turtle()` makes a turtle named `tracy`. Then `tracy.forward(60)` moves it.",
        "look": "Look for: what comes before each command?",
        "code": "tracy = Turtle()\ntracy.forward(60)\ntracy.left(90)\ntracy.forward(30)\n"
      },
      {
        "kind": "try",
        "text": "Use the name in front of each command.",
        "task": "Make `tracy` draw a square of 80.",
        "solution": "tracy = Turtle()\nfor i in range(4):\n    tracy.forward(80)\n    tracy.left(90)\n",
        "hints": [
          "Put `tracy.` in front of each command."
        ]
      },
      {
        "kind": "extend",
        "text": "The same turtle can draw more.",
        "task": "Make `tracy` draw a second square of 40 inside the first.",
        "solution": "tracy = Turtle()\nfor i in range(4):\n    tracy.forward(80)\n    tracy.left(90)\nfor i in range(4):\n    tracy.forward(40)\n    tracy.left(90)\n",
        "hints": [
          "Copy the loop and change `80` to `40`."
        ]
      }
    ]
  },
  {
    "id": "objects-2",
    "unit": 11,
    "title": "Two turtles",
    "concept": "More than one object",
    "objects": true,
    "steps": [
      {
        "kind": "watch",
        "text": "Each turtle is its own object. Each one has its own place and pen.",
        "look": "Look for: which turtle moves at each line?",
        "code": "tracy = Turtle()\nbob = Turtle()\ntracy.forward(40)\nbob.left(90)\nbob.forward(40)\n"
      },
      {
        "kind": "try",
        "text": "Each turtle takes its own commands.",
        "task": "Tracy draws 100 to the right. Bob turns around and draws 100 to the left.",
        "solution": "tracy = Turtle()\nbob = Turtle()\ntracy.forward(100)\nbob.left(180)\nbob.forward(100)\n",
        "hints": [
          "Bob needs `bob.left(180)`.",
          "Change the numbers to 100."
        ]
      },
      {
        "kind": "extend",
        "text": "Both turtles can run the same loop.",
        "task": "At the end of each line, each turtle draws a square of 50.",
        "solution": "tracy = Turtle()\nbob = Turtle()\ntracy.forward(100)\nbob.left(180)\nbob.forward(100)\nfor i in range(4):\n    tracy.forward(50)\n    tracy.left(90)\n    bob.forward(50)\n    bob.left(90)\n",
        "hints": [
          "One loop with 4 lines: 2 for tracy, 2 for bob."
        ]
      }
    ]
  },
  {
    "id": "project-house",
    "unit": 12,
    "title": "House",
    "concept": "Project: put it all together",
    "objects": true,
    "steps": [
      {
        "kind": "watch",
        "text": "Use a function for each part. Call them in order.",
        "look": "Look for: which lines draw the door, and when do they run?",
        "code": "tracy = Turtle()\n\ndef door():\n    for i in range(2):\n        tracy.forward(20)\n        tracy.left(90)\n        tracy.forward(40)\n        tracy.left(90)\n\ndoor()\n"
      },
      {
        "kind": "try",
        "text": "Write `wall()` and `roof()` like `door()`.",
        "task": "Draw a house: a square of 100 with a triangle roof of 100 on top.",
        "solution": "tracy = Turtle()\n\ndef wall():\n    for i in range(4):\n        tracy.forward(100)\n        tracy.left(90)\n\ndef roof():\n    tracy.left(90)\n    tracy.forward(100)\n    tracy.right(90)\n    for i in range(3):\n        tracy.forward(100)\n        tracy.left(120)\n\nwall()\nroof()\n",
        "hints": [
          "`wall()` is a square loop.",
          "For the roof, go up 100 first, then draw a triangle."
        ],
        "starter": "tracy = Turtle()\n\ndef wall():\n    pass\n\ndef roof():\n    pass\n\nwall()\nroof()\n"
      },
      {
        "kind": "extend",
        "text": "Move with the pen up to start a new part.",
        "task": "Add a door 20 wide at x = 40: pen up, `tracy.setposition(40, 0)`, `tracy.setheading(0)`, pen down, `door()`.",
        "solution": "tracy = Turtle()\n\ndef wall():\n    for i in range(4):\n        tracy.forward(100)\n        tracy.left(90)\n\ndef roof():\n    tracy.left(90)\n    tracy.forward(100)\n    tracy.right(90)\n    for i in range(3):\n        tracy.forward(100)\n        tracy.left(120)\n\ndef door():\n    for i in range(2):\n        tracy.forward(20)\n        tracy.left(90)\n        tracy.forward(40)\n        tracy.left(90)\n\nwall()\nroof()\ntracy.penup()\ntracy.setposition(40, 0)\ntracy.setheading(0)\ntracy.pendown()\ndoor()\n",
        "hints": [
          "Copy `door()` from the watch step.",
          "Pen up before you move."
        ]
      },
      {
        "kind": "extend",
        "text": "Add one more part the same way.",
        "task": "Add a window: a square of 20 at (65, 60).",
        "solution": "tracy = Turtle()\n\ndef wall():\n    for i in range(4):\n        tracy.forward(100)\n        tracy.left(90)\n\ndef roof():\n    tracy.left(90)\n    tracy.forward(100)\n    tracy.right(90)\n    for i in range(3):\n        tracy.forward(100)\n        tracy.left(120)\n\ndef door():\n    for i in range(2):\n        tracy.forward(20)\n        tracy.left(90)\n        tracy.forward(40)\n        tracy.left(90)\n\nwall()\nroof()\ntracy.penup()\ntracy.setposition(40, 0)\ntracy.setheading(0)\ntracy.pendown()\ndoor()\ntracy.penup()\ntracy.setposition(65, 60)\ntracy.pendown()\nfor i in range(4):\n    tracy.forward(20)\n    tracy.left(90)\n",
        "hints": [
          "Pen up, `setposition(65, 60)`, pen down.",
          "Then a square loop of 20."
        ]
      }
    ]
  },
  {
    "id": "project-flower",
    "unit": 12,
    "title": "Flower",
    "concept": "Project: loops and circles",
    "objects": true,
    "steps": [
      {
        "kind": "watch",
        "text": "`tracy.circle(30)` draws a circle. Turn a bit after each one.",
        "look": "Look for: where does each circle start?",
        "code": "tracy = Turtle()\ntracy.circle(30)\ntracy.left(90)\ntracy.circle(30)\n"
      },
      {
        "kind": "try",
        "text": "A loop can draw many circles.",
        "task": "Draw a flower: 6 circles of 40, with a left turn of 60 after each.",
        "solution": "tracy = Turtle()\nfor i in range(6):\n    tracy.circle(40)\n    tracy.left(60)\n",
        "hints": [
          "Use `for i in range(6):`.",
          "360 / 6 = 60."
        ]
      },
      {
        "kind": "extend",
        "text": "Add a stem under the flower.",
        "task": "After the loop, turn the turtle to face down (`tracy.setheading(270)`) and go 120.",
        "solution": "tracy = Turtle()\nfor i in range(6):\n    tracy.circle(40)\n    tracy.left(60)\ntracy.setheading(270)\ntracy.forward(120)\n",
        "hints": [
          "`setheading(270)` points down."
        ]
      }
    ]
  },
  {
    "id": "project-spiral",
    "unit": 12,
    "title": "Spiral",
    "concept": "Project: a loop with a growing box",
    "objects": true,
    "steps": [
      {
        "kind": "watch",
        "text": "A box that grows each round makes a spiral.",
        "look": "Look for: how does `side` change each round?",
        "code": "tracy = Turtle()\nside = 10\nfor i in range(8):\n    tracy.forward(side)\n    tracy.left(120)\n    side = side + 10\n"
      },
      {
        "kind": "try",
        "text": "The turn and the count change the shape.",
        "task": "Draw a spiral: 30 lines, start at 5, add 5 each time, turn 91 each time.",
        "solution": "tracy = Turtle()\nside = 5\nfor i in range(30):\n    tracy.forward(side)\n    tracy.left(91)\n    side = side + 5\n",
        "hints": [
          "`range(30)`, `left(91)`.",
          "Start `side` at 5 and add 5."
        ]
      },
      {
        "kind": "extend",
        "text": "More rounds with a smaller step make it dense.",
        "task": "Make it 60 lines, and add 3 each time in place of 5.",
        "solution": "tracy = Turtle()\nside = 5\nfor i in range(60):\n    tracy.forward(side)\n    tracy.left(91)\n    side = side + 3\n",
        "hints": [
          "Change `range(30)` to `range(60)`.",
          "Change `side + 5` to `side + 3`."
        ]
      }
    ]
  }
];
