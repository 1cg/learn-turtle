// Lesson content. Format: src/md/features/lessons.md (Lesson format).
// The body is JSON: test/test_lessons.py reads it with json.
export const LESSONS = [
  {
    "id": "calls-1",
    "unit": 1,
    "title": "First steps",
    "concept": "Programs",
    "objects": false,
    "steps": [
      {
        "kind": "watch",
        "text": "First things first: let's learn what a *program* is. A program is a set of steps for a computer to *execute*, typically one instruction after the other. We are going to be looking at instructions written in *Python*, a widely used programming language. In order to have some fun as we learn, we are going to use *turtle*, a library for drawing based on a simple concept: a turtle moves around on the screen, drawing things as he goes.\n\nWe will start out by calling a *function*. A function is a way to collect a bit of logic into a single place so it can be *called* from other places. Here we are calling a function forward() and passing it an *argument*. Functions in Python take arguments between the () and use commas to separate arguments if we want to pass more than one. Functions have a specific number of arguments they expect. In this case, forward() expects 1 argument: how far to move forward. Try clicking next to see it execute.",
        "look": "Look for: how far does the turtle move?",
        "code": "forward(50)\n"
      },
      {
        "kind": "try",
        "text": "The number in the brackets is how far the turtle walks. A bigger number means a longer walk.\n\nMake the turtle draw a line 100 steps long.",
        "solution": "forward(100)\n",
        "hints": [
          "Change `50` to `100`."
        ]
      },
      {
        "kind": "extend",
        "text": "You can add more steps under your line. Python runs them one after the other.\n\nAdd a turn with `left(90)`, then walk 50 more steps.",
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
        "text": "A program can call more than one function. Python runs the calls in order, one line at a time, top to bottom. The turtle also has a *heading*: the direction it faces. At the start, it faces right.\n\n`left(90)` turns the turtle 90 *degrees* to its left. It does not move and does not draw; it only changes the heading. A full turn is 360 degrees, so 90 is a square corner. In this program the turtle walks, turns, and walks again. Click Next to see it run.",
        "look": "Look for: which line turns the turtle, and which way?",
        "code": "forward(60)\nleft(90)\nforward(60)\n"
      },
      {
        "kind": "try",
        "text": "`left` has a twin: `right`. It turns the other way. Same argument, other direction.\n\nMake the turtle turn right, not left.",
        "solution": "forward(60)\nright(90)\nforward(60)\n",
        "hints": [
          "Change `left` to `right`."
        ]
      },
      {
        "kind": "extend",
        "text": "Each turn and each line add one side to the drawing.\n\nAdd one more right turn and one more line. Now you have 3 sides of a square.",
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
        "text": "Every programmer makes mistakes. When Python cannot run a line, it stops and shows an *error*. An error message has two parts that matter: the *line number* and a short description of the problem.\n\nPython is very exact about names. `forward` works, but `fowrard` is a name Python has never seen, so it gives a *NameError*. Names are also case sensitive: `Forward` is not `forward` either. Click Next to run the program and read the error it shows.",
        "look": "Look for: which line has the error? What does the message say?",
        "code": "forward(100)\nleft(90)\nfowrard(100)\n",
        "expectError": true
      },
      {
        "kind": "try",
        "text": "Python does not guess what you mean. If a name is spelled wrong, Python stops.\n\nFix the line that the error names, so the turtle draws the corner.",
        "solution": "forward(100)\nleft(90)\nforward(100)\n",
        "hints": [
          "Look at line 3.",
          "Check the spelling of `forward`."
        ]
      },
      {
        "kind": "extend",
        "text": "Now the program runs. A fixed program is a program you can build on.\n\nAdd a third side: turn left 90 and walk 100.",
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
        "text": "There is a second kind of error: a *syntax error*. *Syntax* is the grammar of Python: where brackets, commas and colons go. If the grammar is wrong, Python does not run any line at all, not even the good ones.\n\nBrackets always come in pairs: each `(` needs a `)`. On line 1 of this program, the `)` is missing. Python says the `(` was never closed, and gives its line. Click Next and read the message.",
        "look": "Look for: where does Python say the problem is?",
        "code": "forward(80\nleft(90)\nforward(80)\n",
        "expectError": true
      },
      {
        "kind": "try",
        "text": "The error says which bracket has no partner. Find it, and give it one.\n\nAdd the missing bracket so the turtle draws the corner.",
        "solution": "forward(80)\nleft(90)\nforward(80)\n",
        "hints": [
          "Look at line 1.",
          "Add `)` at the end of line 1."
        ]
      },
      {
        "kind": "extend",
        "text": "The corner has two sides. One more line closes it into a triangle.\n\nTurn left 135 and walk 113 to close the triangle.",
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
        "text": "A *comment* is a note for people. In Python, a comment starts with `#` and goes to the end of the line. Python skips comments completely, so you can write anything in them.\n\nGood comments say what a group of lines is for, like `# Up` and `# Right` here. The other lines show that *order* matters: turn first, then walk, gives a different drawing than walk first, then turn. Click Next and watch which lines Python runs and which it skips.",
        "look": "Look for: which lines does Python skip?",
        "code": "# Up\nleft(90)\nforward(40)\n# Right\nright(90)\nforward(40)\n"
      },
      {
        "kind": "try",
        "text": "The order of the lines makes the drawing. Up, then right, makes one stair step.\n\nAdd a second stair step under the first one: up 40, then right 40.",
        "solution": "# Up\nleft(90)\nforward(40)\n# Right\nright(90)\nforward(40)\n# Up\nleft(90)\nforward(40)\n# Right\nright(90)\nforward(40)\n",
        "hints": [
          "Copy the 6 lines and put the copy at the end."
        ]
      },
      {
        "kind": "extend",
        "text": "Comments help you find each part of a long program.\n\nAdd a third step. The stairs do not climb themselves.",
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
        "text": "A *variable* is a name for a value. You can think of it as a box with a label. In Python you make one with `=`: `size = 50` puts 50 in a box named `size`. Here `=` means \"put into\", not \"is equal to\".\n\nAfter that, you can use the name anywhere you could use the value: `forward(size)` is the same as `forward(50)`. A name is one word: letters, digits and `_`, and it cannot start with a digit. Click Next and watch the box fill up.",
        "look": "Look for: where does the program use the value in `size`?",
        "code": "size = 50\nforward(size)\nleft(90)\nforward(size)\n"
      },
      {
        "kind": "try",
        "text": "A square has 4 sides. This program draws only 2.\n\nFinish the square. Add two more sides with `forward(size)`.",
        "solution": "size = 50\nforward(size)\nleft(90)\nforward(size)\nleft(90)\nforward(size)\nleft(90)\nforward(size)\n",
        "hints": [
          "Add `left(90)` and `forward(size)` two times."
        ]
      },
      {
        "kind": "extend",
        "text": "Here is why boxes are useful: change the box, and every line that uses it changes too.\n\nMake the square 100 big. Change only one line.",
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
        "text": "A variable can change. You can put a new value in the box at any time, and the old value is gone. You can also do *math* with variables: `+` adds, `-` subtracts, `*` multiplies and `/` divides.\n\nLook at `step = step * 2`. Python works on the right side first: it takes the value out of `step`, doubles it, and then puts the result back in `step`. So the second `forward(step)` walks twice as far as the first. Click Next and watch the value of `step` change.",
        "look": "Look for: what is in `step` after line 3?",
        "code": "step = 20\nforward(step)\nstep = step * 2\nleft(90)\nforward(step)\n"
      },
      {
        "kind": "try",
        "text": "`*` means multiply. You can multiply by any number.\n\nMake the second line 3 times as long as the first.",
        "solution": "step = 20\nforward(step)\nstep = step * 3\nleft(90)\nforward(step)\n",
        "hints": [
          "Change `* 2` to `* 3`."
        ]
      },
      {
        "kind": "extend",
        "text": "You can change the same box again and again.\n\nAdd a third line after a left turn. Make it 3 times longer again.",
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
        "text": "Every value in Python has a *type*. `50` is an *integer*, a whole number. `\"50\"` with quotes is a *string*: text. They look alike, but they act differently: numbers add, strings stick together.\n\n`int(text)` makes a number from a string, so `side` holds the number 50. `print(...)` shows a value in the output box under the code. If you ever see `5050` where you wanted `100`, a string slipped in. Click Next to see what this program prints.",
        "look": "Look for: what does `print` show? Why is it not 5050?",
        "code": "text = \"50\"\nside = int(text)\nprint(side + side)\nforward(side)\n"
      },
      {
        "kind": "try",
        "text": "If you change the text, the number changes too.\n\nMake the text `\"80\"`. Then add a left turn of 90 and a second line of `side`.",
        "solution": "text = \"80\"\nside = int(text)\nprint(side + side)\nforward(side)\nleft(90)\nforward(side)\n",
        "hints": [
          "Change `\"50\"` to `\"80\"`.",
          "Add `left(90)` and `forward(side)`."
        ]
      },
      {
        "kind": "extend",
        "text": "`print` can show text and a number together: `print(\"side is\", side)`.\n\nPrint `\"side is\"` and `side`. Then finish the square.",
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
        "text": "A *loop* runs the same lines many times. The `for` loop is the most common one. `for i in range(4):` means \"do this 4 times\". Each time is a *round*, and `i` counts the rounds: 0, 1, 2, 3.\n\nThe rules: the `for` line ends with a colon `:`, and the lines inside the loop are indented by 4 spaces. The indent is how Python knows which lines belong to the loop. Here, `forward` and `left` run 4 times, and that makes a square. Click Next to watch each round.",
        "look": "Look for: which lines run 4 times? Which line runs only once?",
        "code": "for i in range(4):\n    forward(40)\n    left(90)\n"
      },
      {
        "kind": "try",
        "text": "The number in `range` says how many times the loop runs. The turn says how sharp each corner is.\n\nChange the program so it draws a triangle with sides of 80.",
        "solution": "for i in range(3):\n    forward(80)\n    left(120)\n",
        "hints": [
          "3 sides.",
          "Turn 120 each time."
        ]
      },
      {
        "kind": "extend",
        "text": "Lines after the loop run when all the rounds are done.\n\nAfter the loop, walk forward 80 and draw the triangle again. Now you have two.",
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
        "text": "With a loop you can draw any shape with equal sides. You need two numbers: how many sides, and how far to turn at each corner.\n\nWhen the turtle goes all the way around a shape, it turns 360 degrees in all. So each turn is 360 divided by the number of sides. This loop runs 5 times and turns 72 each time, because 360 / 5 = 72. Click Next and count the rounds.",
        "look": "Look for: how many times does the loop run? What is 5 x 72?",
        "code": "for i in range(5):\n    forward(40)\n    left(72)\n"
      },
      {
        "kind": "try",
        "text": "6 sides need 6 rounds. 360 / 6 = 60.\n\nDraw a hexagon with 6 sides of 50.",
        "solution": "for i in range(6):\n    forward(50)\n    left(60)\n",
        "hints": [
          "360 / 6 = 60."
        ]
      },
      {
        "kind": "extend",
        "text": "A second loop after the first draws a second shape.\n\nAfter the hexagon, add a loop that draws an octagon: 8 sides of 40.",
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
        "text": "A loop can hold any lines, and that includes another loop. A loop in a loop is a *nested loop*. The *inner loop* runs all its rounds in each round of the *outer loop*.\n\nPython uses the indent to tell them apart. Here the outer loop has 4 spaces, and the lines of the inner loop have 8. The inner loop draws one triangle, and the line `forward(40)` moves the turtle on before the next one. Click Next and count how many times `forward(30)` runs.",
        "look": "Look for: how many times does `forward(30)` run in all?",
        "code": "for n in range(2):\n    for i in range(3):\n        forward(30)\n        left(120)\n    forward(40)\n"
      },
      {
        "kind": "try",
        "text": "The inside loop draws one shape. The outside loop says how many shapes.\n\nDraw 3 squares of 40 in a row.",
        "solution": "for n in range(3):\n    for i in range(4):\n        forward(40)\n        left(90)\n    forward(40)\n",
        "hints": [
          "The outside loop runs 3 times.",
          "The inside loop draws a square."
        ]
      },
      {
        "kind": "extend",
        "text": "With a loop, more shapes cost you one number, not more lines.\n\nDraw 4 squares in the row.",
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
        "text": "Remember *functions*? You called `forward` and `left`. Now you will make your own. `def corner():` *defines* a function named `corner`: a short name for a group of lines.\n\nThe rules: `def`, the name, `()`, and a colon. The lines of the function are indented by 4 spaces. Defining a function does not run it. Python only remembers it. The lines run when you *call* it: `corner()`. Click Next and watch when the lines inside `corner` run.",
        "look": "Look for: does line 2 run at `def`, or at the call?",
        "code": "def corner():\n    forward(50)\n    left(90)\n\ncorner()\ncorner()\n"
      },
      {
        "kind": "try",
        "text": "Each call runs the whole function again.\n\nCall `corner()` two more times to close the square.",
        "solution": "def corner():\n    forward(50)\n    left(90)\n\ncorner()\ncorner()\ncorner()\ncorner()\n",
        "hints": [
          "Add `corner()` two times."
        ]
      },
      {
        "kind": "extend",
        "text": "A function can call another function. Small commands make big commands.\n\nPut your 4 calls in a new function `square()`. Call `square()`, turn 180, and call `square()` again.",
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
        "text": "A function is more useful when it can take an *argument*, like `forward(50)` does. To get an argument, the function needs a *parameter*: a variable name between its brackets.\n\nIn `def line(length):`, `length` is the parameter. The call `line(20)` puts 20 into `length`, and then the lines of the function run. The next call, `line(40)`, puts 40 in. Same function, new value. Click Next and watch the value of `length` at each call.",
        "look": "Look for: what is in `length` at each call?",
        "code": "def line(length):\n    forward(length)\n    left(90)\n\nline(20)\nline(40)\n"
      },
      {
        "kind": "try",
        "text": "Each call can give a different value. Same function, new number.\n\nAdd `line(60)` and `line(80)`. You get a spiral.",
        "solution": "def line(length):\n    forward(length)\n    left(90)\n\nline(20)\nline(40)\nline(60)\nline(80)\n",
        "hints": [
          "Add two calls."
        ]
      },
      {
        "kind": "extend",
        "text": "Many calls in a row? That sounds like a job for a loop.\n\nDraw 8 lines: 20, 40, and up to 160. Use a loop and `line(n * 20)`.",
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
        "text": "A function can also give a value back to the code that called it. It does that with `return`. The value it gives back is the *return value*.\n\n`half(100)` runs the function with `n` = 100, and `return n / 2` gives back 50. Python then uses that value in place of the call, so `forward(half(100))` is the same as `forward(50)`. When `return` runs, the function stops at once. Click Next and watch the value come back.",
        "look": "Look for: what does `half(100)` give back?",
        "code": "def half(n):\n    return n / 2\n\nforward(half(100))\n"
      },
      {
        "kind": "try",
        "text": "You can write your own function like `half`.\n\nAdd `double(n)` that returns `n * 2`. Then turn left 90 and walk `forward(double(40))`.",
        "solution": "def half(n):\n    return n / 2\n\ndef double(n):\n    return n * 2\n\nforward(half(100))\nleft(90)\nforward(double(40))\n",
        "hints": [
          "Copy `half` and change it.",
          "Add `left(90)` and `forward(double(40))`."
        ]
      },
      {
        "kind": "extend",
        "text": "You can put a call inside a call. Python runs the inside call first.\n\nTurn left 90 again and walk `forward(half(double(60)))`.",
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
        "text": "Programs can make choices. An `if` statement runs its lines only when a *condition* is true. An `else` part runs when the condition is false.\n\nThe rules: `if`, a condition, and a colon; the lines under it are indented. `else:` lines up with its `if`. Here the condition is `i == 2`. `==` asks \"are these equal?\", while one `=` puts a value in a box. Mixing them up is a classic mistake. Click Next and watch which part runs in each round.",
        "look": "Look for: in which round is the pen up?",
        "code": "for i in range(4):\n    if i == 2:\n        penup()\n    else:\n        pendown()\n    forward(20)\n"
      },
      {
        "kind": "try",
        "text": "`%` gives the rest after a division. `i % 2 == 0` is True for 0, 2 and 4: the even numbers.\n\nMake a dashed line of 6 parts. Put the pen down when `i % 2 == 0`, else put it up.",
        "solution": "for i in range(6):\n    if i % 2 == 0:\n        pendown()\n    else:\n        penup()\n    forward(20)\n",
        "hints": [
          "Change `range(4)` to `range(6)`.",
          "Change the test to `i % 2 == 0` and swap the pen lines."
        ]
      },
      {
        "kind": "extend",
        "text": "Your dashed line is a loop. You can put a loop in a loop.\n\nDraw a dashed square: 4 sides, each one your dashed line, with `left(90)` after each side.",
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
        "text": "A condition gives a *boolean*: a value that is either `True` or `False`. Python writes them with a capital letter.\n\nThese *comparisons* make booleans: `>` (bigger than), `<` (smaller than), `==` (equal to), `!=` (not equal to), `>=` and `<=`. You can print a boolean, keep it in a variable, or use it in an `if`. Here `size` is 30, so `size > 20` is `True` and `size == 20` is `False`. Click Next and see what each `print` shows.",
        "look": "Look for: what does each `print` show?",
        "code": "size = 30\nprint(size > 20)\nprint(size == 20)\n"
      },
      {
        "kind": "try",
        "text": "You can keep a boolean in a box, and test the box with `if`.\n\nIf `big` is True, draw a square of 100. Else, draw a triangle of 50.",
        "solution": "big = True\nif big:\n    for i in range(4):\n        forward(100)\n        left(90)\nelse:\n    for i in range(3):\n        forward(50)\n        left(120)\n",
        "hints": [
          "Start with `if big:`.",
          "Put the square loop under `if` and the triangle loop under `else`."
        ],
        "starter": "big = True\n"
      },
      {
        "kind": "extend",
        "text": "Change the box, and the same test gives a new answer.\n\nAfter your `if`, set `big = False` and copy the whole `if` again. Now both shapes draw.",
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
        "text": "A `for` loop runs a fixed number of times. A `while` loop is different: it keeps going as long as its condition is true.\n\nPython checks the condition before each round. When it is false, the loop ends. So the loop must change something, like `n = n + 1` here. Else the condition stays true and the loop never stops: an *endless loop*. This loop draws one side for each value of `n`: 0, 1 and 2. Click Next and watch `n` grow until the loop ends.",
        "look": "Look for: what is `n` when the loop stops?",
        "code": "n = 0\nwhile n < 3:\n    forward(30)\n    left(120)\n    n = n + 1\n"
      },
      {
        "kind": "try",
        "text": "The test can use any box, and the box can grow each round.\n\nDraw a square spiral. Start `side` at 10, add 10 each round, and stop after 100.",
        "solution": "side = 10\nwhile side <= 100:\n    forward(side)\n    left(90)\n    side = side + 10\n",
        "hints": [
          "Use `side` in place of `n`.",
          "`while side <= 100:`"
        ]
      },
      {
        "kind": "extend",
        "text": "A small change to the turn can twist the whole drawing.\n\nTurn 91 in place of 90, and stop after 150.",
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
        "text": "A *list* holds many values in one variable. You write it with square brackets and commas: `[\"red\", \"blue\"]`. Each value in the list is an *item*, and the order of the items stays the same.\n\nA `for` loop can go over a list: `for n in names:` runs one round for each item, and puts that item in `n`. So the first round prints `red` and the second prints `blue`. Click Next and watch `n` change.",
        "look": "Look for: how many times does the loop run? What is `n` each time?",
        "code": "names = [\"red\", \"blue\"]\nfor n in names:\n    print(n)\n"
      },
      {
        "kind": "try",
        "text": "A loop works on a list of numbers too. Each number can be a length.\n\nDraw one line for each size in the list, with a left turn of 90 after each.",
        "solution": "sizes = [30, 60, 90, 120]\nfor s in sizes:\n    forward(s)\n    left(90)\n",
        "hints": [
          "Use `for s in sizes:`."
        ],
        "starter": "sizes = [30, 60, 90, 120]\n"
      },
      {
        "kind": "extend",
        "text": "To draw more, add values to the list. The loop does not change.\n\nAdd 150 and 180 to the list.",
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
        "text": "A list is a good place to keep *data*: numbers that the program uses. When the data changes, you change the list, and the code stays the same.\n\nThis loop draws one bar for each number in `data`. The number sets the height: up, across, and down again. The `left` and `right` turns put the turtle back facing right, ready for the next bar. Click Next and watch each value become a bar.",
        "look": "Look for: what part of the drawing does each value make?",
        "code": "data = [20, 40]\nfor d in data:\n    left(90)\n    forward(d)\n    right(90)\n    forward(10)\n    right(90)\n    forward(d)\n    left(90)\n"
      },
      {
        "kind": "try",
        "text": "Change the data, and the chart changes.\n\nDraw bars that are 40, 80 and 60 high and 20 wide.",
        "solution": "data = [40, 80, 60]\nfor d in data:\n    left(90)\n    forward(d)\n    right(90)\n    forward(20)\n    right(90)\n    forward(d)\n    left(90)\n",
        "hints": [
          "Change the list.",
          "Change `forward(10)` to `forward(20)`."
        ]
      },
      {
        "kind": "extend",
        "text": "The loop draws one bar for each value. More values, more bars.\n\nAdd two more bars: 100 and 20.",
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
        "text": "Until now, you gave commands to one turtle with no name. Now we make a turtle *object*. An object is a thing in your program that keeps its own data and has its own functions, called *methods*.\n\n`tracy = Turtle()` makes a new turtle and puts it in a variable named `tracy`. To give that turtle a command, write its name, a dot, then the method: `tracy.forward(60)`. From now on, we always say which turtle moves. Click Next to watch `tracy` draw.",
        "look": "Look for: what comes before each command?",
        "code": "tracy = Turtle()\ntracy.forward(60)\ntracy.left(90)\ntracy.forward(30)\n"
      },
      {
        "kind": "try",
        "text": "With objects, you say which turtle does each command. Put the name and a dot in front.\n\nMake `tracy` draw a square of 80.",
        "solution": "tracy = Turtle()\nfor i in range(4):\n    tracy.forward(80)\n    tracy.left(90)\n",
        "hints": [
          "Put `tracy.` in front of each command."
        ]
      },
      {
        "kind": "extend",
        "text": "One turtle can draw as much as you like.\n\nMake `tracy` draw a second square of 40 inside the first.",
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
        "text": "The great thing about objects: you can make as many as you like. Each call to `Turtle()` makes a new turtle with its own place, heading and pen.\n\nHere `tracy` and `bob` both start in the middle. A command with `tracy.` moves only `tracy`, and `bob` stays where it is. The name before the dot always says which object does the work. Click Next and watch which turtle moves at each line.",
        "look": "Look for: which turtle moves at each line?",
        "code": "tracy = Turtle()\nbob = Turtle()\ntracy.forward(40)\nbob.left(90)\nbob.forward(40)\n"
      },
      {
        "kind": "try",
        "text": "Each turtle takes only the commands with its name.\n\nMake `tracy` draw 100 to the right. Make `bob` turn around and draw 100 to the left.",
        "solution": "tracy = Turtle()\nbob = Turtle()\ntracy.forward(100)\nbob.left(180)\nbob.forward(100)\n",
        "hints": [
          "Bob needs `bob.left(180)`.",
          "Change the numbers to 100."
        ]
      },
      {
        "kind": "extend",
        "text": "Two turtles can share one loop. Each line in the loop still names its turtle.\n\nAt the end of each line, make each turtle draw a square of 50.",
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
        "text": "Time for a project. Big programs are made of small parts, and *functions* are how we name the parts. Here, `door()` draws a door. A house will also need a wall and a roof.\n\nNotice the parts of this program: first the turtle object, then the function definition, then the call at the end. Inside `door`, a loop runs 2 times, and each round draws two sides of the rectangle. Click Next and watch when the lines in `door` run.",
        "look": "Look for: which lines draw the door, and when do they run?",
        "code": "tracy = Turtle()\n\ndef door():\n    for i in range(2):\n        tracy.forward(20)\n        tracy.left(90)\n        tracy.forward(40)\n        tracy.left(90)\n\ndoor()\n"
      },
      {
        "kind": "try",
        "text": "A house is a square wall with a triangle roof on top.\n\nWrite `wall()` and `roof()`. Draw a square of 100, then a triangle roof of 100 on top.",
        "solution": "tracy = Turtle()\n\ndef wall():\n    for i in range(4):\n        tracy.forward(100)\n        tracy.left(90)\n\ndef roof():\n    tracy.left(90)\n    tracy.forward(100)\n    tracy.right(90)\n    for i in range(3):\n        tracy.forward(100)\n        tracy.left(120)\n\nwall()\nroof()\n",
        "hints": [
          "`wall()` is a square loop.",
          "For the roof, go up 100 first, then draw a triangle."
        ],
        "starter": "tracy = Turtle()\n\ndef wall():\n    pass\n\ndef roof():\n    pass\n\nwall()\nroof()\n"
      },
      {
        "kind": "extend",
        "text": "To start a new part in a new place, lift the pen, move, and put the pen down again.\n\nAdd a door 20 wide at x = 40. Use `tracy.setposition(40, 0)` and `tracy.setheading(0)` with the pen up, then call `door()`.",
        "solution": "tracy = Turtle()\n\ndef wall():\n    for i in range(4):\n        tracy.forward(100)\n        tracy.left(90)\n\ndef roof():\n    tracy.left(90)\n    tracy.forward(100)\n    tracy.right(90)\n    for i in range(3):\n        tracy.forward(100)\n        tracy.left(120)\n\ndef door():\n    for i in range(2):\n        tracy.forward(20)\n        tracy.left(90)\n        tracy.forward(40)\n        tracy.left(90)\n\nwall()\nroof()\ntracy.penup()\ntracy.setposition(40, 0)\ntracy.setheading(0)\ntracy.pendown()\ndoor()\n",
        "hints": [
          "Copy `door()` from the watch step.",
          "Pen up before you move."
        ]
      },
      {
        "kind": "extend",
        "text": "One more part, the same way.\n\nAdd a window: a square of 20 at (65, 60).",
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
        "text": "`tracy.circle(30)` draws a circle with a *radius* of 30. The radius is the distance from the middle of the circle to its edge. The turtle walks the circle to its left and stops where it started.\n\nIf you turn between circles, the next circle points another way. Turn a bit after each circle, again and again, and you get a pattern. Here there are only 2 circles with a turn of 90 between them. Click Next and watch where each circle starts.",
        "look": "Look for: where does each circle start?",
        "code": "tracy = Turtle()\ntracy.circle(30)\ntracy.left(90)\ntracy.circle(30)\n"
      },
      {
        "kind": "try",
        "text": "A loop can draw many circles, with a turn after each one.\n\nDraw a flower: 6 circles of 40, with a left turn of 60 after each.",
        "solution": "tracy = Turtle()\nfor i in range(6):\n    tracy.circle(40)\n    tracy.left(60)\n",
        "hints": [
          "Use `for i in range(6):`.",
          "360 / 6 = 60."
        ]
      },
      {
        "kind": "extend",
        "text": "A flower needs a stem. Turtles do not do gardening, so you must tell it.\n\nAfter the loop, point the turtle down with `tracy.setheading(270)` and walk 120.",
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
        "text": "A variable that changes in each round of a loop can make a pattern grow. This program uses a variable, a loop and a turtle object together.\n\n`side` starts at 10. In each round, the turtle walks `side`, turns, and then `side = side + 10` makes the next line longer. The turn of 120 would make a triangle, but because the sides grow, the lines never close: you get a spiral. Click Next and watch `side` grow.",
        "look": "Look for: how does `side` change each round?",
        "code": "tracy = Turtle()\nside = 10\nfor i in range(8):\n    tracy.forward(side)\n    tracy.left(120)\n    side = side + 10\n"
      },
      {
        "kind": "try",
        "text": "The turn and the number of rounds change the shape a lot.\n\nDraw a spiral: 30 lines. Start at 5, add 5 each time, and turn 91 each time.",
        "solution": "tracy = Turtle()\nside = 5\nfor i in range(30):\n    tracy.forward(side)\n    tracy.left(91)\n    side = side + 5\n",
        "hints": [
          "`range(30)`, `left(91)`.",
          "Start `side` at 5 and add 5."
        ]
      },
      {
        "kind": "extend",
        "text": "More rounds with a smaller step make a dense spiral.\n\nMake it 60 lines, and add 3 each time in place of 5.",
        "solution": "tracy = Turtle()\nside = 5\nfor i in range(60):\n    tracy.forward(side)\n    tracy.left(91)\n    side = side + 3\n",
        "hints": [
          "Change `range(30)` to `range(60)`.",
          "Change `side + 5` to `side + 3`."
        ]
      }
    ]
  }
];
