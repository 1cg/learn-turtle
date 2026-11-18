// Test lessons for the lesson engine (steps format). Open the site with ?fixture to use them.
// The body is JSON: test/test_lessons.py checks it too.
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
  }
];
