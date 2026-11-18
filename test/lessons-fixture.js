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
  }
];
