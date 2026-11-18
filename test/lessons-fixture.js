// Test lessons for the lesson engine (steps format). Open the site with ?fixture to use them.
// The body is JSON: test/test_lessons.py checks it too.
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
        "text": "A program is a list of steps. Python does them in order, from the top line to the bottom line.\n\nHere is a program with one step. `forward(50)` tells the turtle to walk 50 steps. Press Next and watch it go.",
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
        "text": "Everybody makes errors. Good programmers read them. An error message tells you the line and the problem.\n\nThis program has an error on purpose. Run it and read what Python says.",
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
        "text": "A variable is a box with a name. `size = 50` puts 50 in a box named `size`. Then `forward(size)` uses what is in the box.\n\nWatch where the program uses the value in `size`.",
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
        "text": "Typing the same lines again and again gets boring. A `for` loop runs the lines inside it many times for you.\n\nThe lines inside the loop have 4 spaces in front. Watch which lines run 4 times and which line runs only once.",
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
