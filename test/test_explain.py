"""Tests for py/explain.py. Run: python3 test/test_explain.py"""
import json
import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "py"))
import tracer   # noqa: E402
import explain  # noqa: E402


def texts(code):
    r = json.loads(tracer.run(code))
    ex = explain.explain(code, r["steps"], r["cmds"], r["out"])
    return [(s["line"], t) for s, t in zip(r["steps"], ex) if t]


def has(code, *wanted):
    got = [t for _, t in texts(code)]
    missing = [w for w in wanted if w not in got]
    return missing, got


CASES = [
    ("square loop", "for i in range(4):\n    forward(50)\n    left(90)\n",
     ["round 1 of 4, i is 0", "round 4 of 4, i is 3", "the turtle moves forward 50",
      "the turtle turns left 90 degrees", "the loop is done"]),
    ("variables", "size = 30\nsize = size + 10\nsize += 0\nforward(size)\n",
     ["size gets 30", "size changes from 30 to 40", "size stays 40", "the turtle moves forward 40 (size)"]),
    ("function", "def sq(size):\n    forward(size)\n    return size * 4\n\nn = sq(30)\n",
     ["remember the function sq, do not run it yet", "call sq", "jump into sq with size = 30",
      "give back 120", "sq is done, go back to line 5, it gives back 120"]),
    ("if else", "x = 5\nif x > 10:\n    forward(10)\nelse:\n    left(10)\n",
     ["x > 10 is False, so run the else part"]),
    ("elif", "x = 5\nif x > 10:\n    pass\nelif x > 1:\n    pass\n",
     ["x > 10 is False, so check the next test", "x > 1 is True, so run the if part", "do nothing"]),
    ("while", "n = 0\nwhile n < 2:\n    n += 1\n",
     ["n < 2 is True, so run round 1", "n < 2 is True, so run round 2", "n < 2 is False, so the loop ends",
      "n changes from 0 to 1"]),
    ("print", "print('hi')\n", ['show "hi"']),
    ("pen and color", "penup()\nforward(20)\npendown()\ncolor('red')\ncircle(40)\ncircle(40, 90)\n",
     ["the turtle lifts the pen: no drawing now", "the turtle moves forward 20 without drawing",
      "the turtle puts the pen down: drawing now", "the turtle pen color is now red",
      "the turtle draws a circle, radius 40", "the turtle draws part of a circle, radius 40"]),
    ("objects", "bob = Turtle()\nbob.forward(10)\nbob.right(45)\n",
     ["make a new turtle named bob", "bob moves forward 10", "bob turns right 45 degrees"]),
    ("list loop", "for c in ['red', 'blue']:\n    color(c)\n",
     ["round 1 of 2, c is 'red'", "round 2 of 2, c is 'blue'", "the turtle pen color is now blue"]),
    ("nested loops", "for a in range(2):\n    for b in range(3):\n        pass\n",
     ["round 2 of 2, a is 1", "round 3 of 3, b is 2"]),
    ("loop in function called twice", "def f():\n    for i in range(2):\n        pass\nf()\nf()\n",
     ["round 2 of 2, i is 1"]),
]

fails = 0
for name, code, wanted in CASES:
    missing, got = has(code, *wanted)
    if missing:
        fails += 1
        print("FAIL", name, "missing:", missing)
        print("     got:", got)
    else:
        print("PASS", name)
print("%d/%d pass" % (len(CASES) - fails, len(CASES)))
sys.exit(1 if fails else 0)
