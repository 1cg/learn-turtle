"""Plain-word text for each recorded step. The text shows as a ghost comment.

explain(code, steps, cmds, out) returns one string (or None) per step.
The text for a "line" step tells what that line did. The recording holds the
whole run, so the text can use values from after the line and from later steps.
"""
import ast
import math

NOUN = "the turtle"


def _val(v):
    if v is None:
        return "?"
    return v.get("repr") or v.get("type", "?")


def _num(x):
    x = round(x, 1)
    return str(int(x)) if x == int(x) else str(x)


class _Loop:
    """Header line hits of one loop run (one activation)."""

    def __init__(self):
        self.hits = []   # step indices of the header line
        self.exits = 0   # 1 if the last hit left the loop


def explain(code, steps, cmds, out):
    try:
        tree = ast.parse(code)
    except SyntaxError:
        return [None] * len(steps)
    return _Explainer(code, tree, steps, cmds, out).run()


class _Explainer:
    def __init__(self, code, tree, steps, cmds, out):
        self.code, self.steps, self.cmds, self.out = code, steps, cmds, out
        self.stmts = {}
        for node in ast.walk(tree):
            if isinstance(node, ast.stmt):
                self.stmts.setdefault(node.lineno, node)
        self.loop_round = {}  # step index -> (round, total)
        self._scan_loops()

    # ---- helpers ----
    def src(self, node):
        return ast.get_source_segment(self.code, node) or "the test"

    def depth(self, k):
        return len(self.steps[k]["frames"])

    def next_same(self, k):
        """First later step in the same frame (any event), or None."""
        d = self.depth(k)
        for j in range(k + 1, len(self.steps)):
            dj = self.depth(j)
            if dj == d:
                return j
            if dj < d:
                return None
        return None

    def next_line(self, k):
        j = self.next_same(k)
        if j is None or self.steps[j]["event"] != "line":
            return None
        return self.steps[j]["line"]

    def vars_at(self, k):
        if k is None:
            return {}
        return self.steps[k]["frames"][-1]["vars"]

    @staticmethod
    def in_body(stmts, line):
        if not stmts or line is None:
            return False
        return stmts[0].lineno <= line <= stmts[-1].end_lineno

    # ---- loops: round k of N ----
    def _scan_loops(self):
        loops = {n.lineno: n for n in self.stmts.values() if isinstance(n, (ast.For, ast.While))}
        if not loops:
            return
        active = {}  # (line, depth) -> _Loop
        done = []
        for k, s in enumerate(self.steps):
            d = len(s["frames"])
            for key in list(active):
                line, ad = key
                node = loops[line]
                if d < ad or (d == ad and not (node.lineno <= s["line"] <= node.end_lineno)):
                    done.append(active.pop(key))
            if s["event"] == "line" and s["line"] in loops:
                active.setdefault((s["line"], d), _Loop()).hits.append(k)
        done.extend(active.values())
        for lp in done:
            node = loops[self.steps[lp.hits[0]]["line"]]
            last_in = self.in_body(node.body, self.next_line(lp.hits[-1]))
            total = len(lp.hits) if last_in else len(lp.hits) - 1
            for r, k in enumerate(lp.hits, 1):
                self.loop_round[k] = (r, total)

    # ---- main ----
    def run(self):
        texts = []
        for k, s in enumerate(self.steps):
            try:
                if s["event"] == "line":
                    texts.append(self.line_text(k))
                elif s["event"] == "call":
                    texts.append(self.call_text(k))
                elif s["event"] == "return":
                    texts.append(self.return_text(k))
                else:
                    texts.append(None)
            except Exception:
                texts.append("run line %d" % s["line"])
        return texts

    def call_text(self, k):
        s = self.steps[k]
        if len(s["frames"]) < 2:
            return None
        params = ", ".join("%s = %s" % (n, _val(v)) for n, v in s["frames"][-1]["vars"].items())
        return "jump into %s" % s["fn"] + (" with " + params if params else "")

    def return_text(self, k):
        s = self.steps[k]
        if len(s["frames"]) < 2:
            return "the program is done"
        text = "%s is done, go back to line %d" % (s["fn"], s["frames"][-2]["line"])
        ret = _val(s.get("ret"))
        if ret != "None":
            text += ", it gives back %s" % ret
        return text

    def line_text(self, k):
        s = self.steps[k]
        node = self.stmts.get(s["line"])
        nxt = self.steps[k + 1] if k + 1 < len(self.steps) else None
        if node is None:
            return None
        if nxt is not None and nxt["event"] == "call" and not isinstance(node, (ast.For, ast.While, ast.If)):
            return "call %s" % nxt["fn"]

        if isinstance(node, ast.FunctionDef):
            return "remember the function %s, do not run it yet" % node.name
        if isinstance(node, (ast.Import, ast.ImportFrom)):
            return "load the turtle tools"
        if isinstance(node, (ast.Assign, ast.AugAssign, ast.AnnAssign)):
            return self.assign_text(k, node)
        if isinstance(node, ast.Expr) and isinstance(node.value, ast.Call):
            return self.call_line_text(k, node.value)
        if isinstance(node, ast.For):
            return self.for_text(k, node)
        if isinstance(node, ast.While):
            return self.while_text(k, node)
        if isinstance(node, ast.If):
            return self.if_text(k, node)
        if isinstance(node, ast.Return):
            j = self.next_same(k)
            if j is not None and self.steps[j]["event"] == "return":
                return "give back %s" % _val(self.steps[j].get("ret"))
            return "give back a value"
        if isinstance(node, ast.Pass):
            return "do nothing"
        if isinstance(node, ast.Break):
            return "leave the loop now"
        if isinstance(node, ast.Continue):
            return "skip to the next round"
        return "run line %d" % s["line"]

    def assign_text(self, k, node):
        targets = node.targets if isinstance(node, ast.Assign) else [node.target]
        names = []
        for t in targets:
            if isinstance(t, ast.Name):
                names.append(t.id)
            elif isinstance(t, ast.Tuple):
                names += [e.id for e in t.elts if isinstance(e, ast.Name)]
        if not names:
            return "change %s" % self.src(targets[0])
        value = getattr(node, "value", None)
        if isinstance(value, ast.Call) and isinstance(value.func, ast.Name) and value.func.id == "Turtle":
            return "make a new turtle named %s" % names[0]
        before, after = self.vars_at(k), self.vars_at(self.next_same(k))
        parts = []
        for n in names:
            new = _val(after.get(n))
            if n not in before:
                parts.append("%s gets %s" % (n, new))
            elif _val(before[n]) != new:
                parts.append("%s changes from %s to %s" % (n, _val(before[n]), new))
            else:
                parts.append("%s stays %s" % (n, new))
        return ", ".join(parts)

    def call_line_text(self, k, call):
        f = call.func
        if isinstance(f, ast.Name):
            name, who = f.id, NOUN
        elif isinstance(f, ast.Attribute):
            name = f.attr
            who = f.value.id if isinstance(f.value, ast.Name) else NOUN
        else:
            return "run line %d" % self.steps[k]["line"]
        if name == "print":
            j = self.next_same(k)
            end = self.steps[j]["out"] if j is not None else len(self.out)
            text = self.out[self.steps[k]["out"]:end].rstrip("\n")
            return 'show "%s"' % text if "\n" not in text else "show some lines"
        j = self.next_same(k)
        end = self.steps[j]["cmd"] if j is not None else len(self.cmds)
        made = self.cmds[self.steps[k]["cmd"]:end]
        if not made:
            if name == "speed":
                return "speed does nothing here, use the speed menu"
            return "run %s" % name
        return self.turtle_text(name, who, made[-1], call)

    def turtle_text(self, name, who, c, call):
        a = c["after"]
        because = ""
        if call.args and isinstance(call.args[0], ast.Name):
            because = " (%s)" % call.args[0].id
        if name in ("forward", "fd", "backward", "back", "bk"):
            (x0, y0), (x1, y1) = c["pts"][0], c["pts"][-1]
            d = _num(math.hypot(x1 - x0, y1 - y0))
            way = "forward" if name in ("forward", "fd") else "back"
            draw = "" if c.get("draw") else " without drawing"
            return "%s moves %s %s%s%s" % (who, way, d, because, draw)
        if name in ("left", "lt", "right", "rt"):
            way = "left" if name in ("left", "lt") else "right"
            return "%s turns %s %s degrees%s" % (who, way, _num(abs(c["by"])), because)
        if name in ("setheading", "seth"):
            return "%s now faces %s degrees" % (who, _num(a["h"]))
        if name == "circle":
            part = "a circle" if abs(c["extent"]) >= 360 else "part of a circle"
            return "%s draws %s, radius %s%s" % (who, part, _num(abs(c["r"])), because)
        if name in ("goto", "setposition", "setpos", "setx", "sety", "home"):
            return "%s moves to (%s, %s)" % (who, _num(a["x"]), _num(a["y"]))
        if name in ("penup", "pu", "up"):
            return "%s lifts the pen: no drawing now" % who
        if name in ("pendown", "pd", "down"):
            return "%s puts the pen down: drawing now" % who
        if name in ("color", "pencolor"):
            return "%s pen color is now %s" % (who, a["color"])
        if name == "fillcolor":
            return "%s fill color is now %s" % (who, a["fill"])
        if name in ("pensize", "width"):
            return "%s pen size is now %s" % (who, _num(a["width"]))
        if name == "begin_fill":
            return "%s starts a shape to fill" % who
        if name == "end_fill":
            return "%s fills the shape with %s" % (who, c.get("fillcolor"))
        if name == "dot":
            return "%s draws a dot, size %s" % (who, _num(c["size"]))
        if name == "write":
            return '%s writes "%s"' % (who, c["text"])
        if name in ("hideturtle", "ht"):
            return "%s hides" % who
        if name in ("showturtle", "st"):
            return "%s shows itself" % who
        if name == "clear":
            return "%s erases its drawing" % who
        if name == "bgcolor":
            return "the background is now %s" % c["bg"]
        return "run %s" % name

    def for_text(self, k, node):
        r, total = self.loop_round.get(k, (None, None))
        nl = self.next_line(k)
        if not self.in_body(node.body, nl):
            return "the loop is done"
        var = ""
        if isinstance(node.target, ast.Name):
            var = ", %s is %s" % (node.target.id, _val(self.vars_at(self.next_same(k)).get(node.target.id)))
        return "round %d of %d%s" % (r, total, var)

    def while_text(self, k, node):
        test = self.src(node.test)
        r, _ = self.loop_round.get(k, (None, None))
        if self.in_body(node.body, self.next_line(k)):
            return "%s is True, so run round %d" % (test, r)
        return "%s is False, so the loop ends" % test

    def if_text(self, k, node):
        test = self.src(node.test)
        nl = self.next_line(k)
        if self.in_body(node.body, nl):
            return "%s is True, so run the if part" % test
        if node.orelse and self.in_body(node.orelse, nl):
            if len(node.orelse) == 1 and isinstance(node.orelse[0], ast.If) and node.orelse[0].lineno == nl:
                return "%s is False, so check the next test" % test
            return "%s is False, so run the else part" % test
        return "%s is False, so skip the if part" % test
