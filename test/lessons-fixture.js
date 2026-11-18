// Test lessons for the lesson engine. Open the site with ?fixture to use them.
export const LESSONS = [
  {
    id: "calls-1", unit: 1, title: "First steps", concept: "A program is steps in order",
    text: "Python runs your lines from top to bottom. `forward(100)` moves the turtle.",
    task: "Draw a line 100 steps long.",
    starter: "# Move the turtle\n", solution: "forward(100)\n",
    hints: ["Use `forward(100)`."], example: "forward(50)\nleft(90)\nforward(50)\n", objects: false,
  },
  {
    id: "variables-1", unit: 4, title: "Variables", concept: "A variable is a box with a name",
    text: "Put a value in a box with `=`. Then use the name.",
    task: "Draw the square. Put the side length in a box named `size`.",
    starter: "size = 100\nfor i in range(3):\n    forward(size)\n    left(90)\n",
    solution: "size = 100\nfor i in range(4):\n    forward(size)\n    left(90)\n",
    hints: ["A square has 4 sides.", "Change `range(3)` to `range(4)`."],
    example: "size = 30\nforward(size)\nsize = 60\nforward(size)\n", objects: false,
  },
  {
    id: "loops-1", unit: 6, title: "Triangle", concept: "A loop repeats lines",
    text: "A `for` loop runs the lines inside it many times.",
    task: "Draw a triangle with sides of 80.",
    starter: "", solution: "for i in range(3):\n    forward(80)\n    left(120)\n",
    hints: ["Turn 120 degrees each time."], example: "", objects: false,
  },
];
