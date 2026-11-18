"""Recording turtle with the CodeHS Tracy API.

Each call adds a command to _cmds. The browser draws the commands.
Canvas: 400 x 400, origin at center, y up, heading 0 = east.
"""
import math
import sys

_cmds = []
_turtles = []
_KID_FILE = "<kid>"


def _kid_line():
    f = sys._getframe(1)
    while f is not None:
        if f.f_code.co_filename == _KID_FILE:
            return f.f_lineno
        f = f.f_back
    return 0


def _color_value(c):
    if isinstance(c, (tuple, list)) and len(c) == 3:
        vals = list(c)
        if all(isinstance(v, (int, float)) and v <= 1 for v in vals):
            vals = [int(v * 255) for v in vals]
        return "rgb(%d,%d,%d)" % tuple(int(v) for v in vals)
    if isinstance(c, str):
        return c.replace(" ", "").lower()
    raise TypeError("color must be a name like \"red\" or a hex like \"#ff0000\"")


def _num(v, name):
    if isinstance(v, bool) or not isinstance(v, (int, float)):
        raise TypeError("%s needs a number, but got %r" % (name, v))
    return v


class Turtle:
    def __init__(self):
        self._id = len(_turtles)
        _turtles.append(self)
        self._x = 0.0
        self._y = 0.0
        self._h = 0.0
        self._pen = True
        self._color = "black"
        self._fill = "black"
        self._width = 1
        self._visible = True
        self._fillpts = None
        if _turtles[0] is not self:
            _style.add("object")
        self._emit("new")

    # ---- recording ----
    def _state(self):
        return {"t": self._id, "x": round(self._x, 3), "y": round(self._y, 3),
                "h": round(self._h % 360, 3), "pen": self._pen, "color": self._color,
                "fill": self._fill, "width": self._width, "visible": self._visible}

    def _emit(self, op, **kw):
        cmd = {"op": op, "line": _kid_line()}
        cmd.update(kw)
        cmd["after"] = self._state()
        _cmds.append(cmd)

    def _move_to(self, x, y, op="move"):
        x0, y0 = self._x, self._y
        self._x, self._y = float(x), float(y)
        if self._fillpts is not None:
            self._fillpts.append([round(self._x, 3), round(self._y, 3)])
        self._emit(op, pts=[[round(x0, 3), round(y0, 3)], [round(self._x, 3), round(self._y, 3)]],
                   draw=self._pen)

    # ---- movement ----
    def forward(self, distance):
        d = _num(distance, "forward")
        r = math.radians(self._h)
        self._move_to(self._x + d * math.cos(r), self._y + d * math.sin(r))

    def backward(self, distance):
        d = _num(distance, "backward")
        r = math.radians(self._h)
        self._move_to(self._x - d * math.cos(r), self._y - d * math.sin(r))

    def left(self, angle):
        h0 = self._h
        self._h = (self._h + _num(angle, "left")) % 360
        self._emit("turn", h0=round(h0, 3), by=angle)

    def right(self, angle):
        h0 = self._h
        self._h = (self._h - _num(angle, "right")) % 360
        self._emit("turn", h0=round(h0, 3), by=-angle)

    def setheading(self, angle):
        h0 = self._h
        self._h = _num(angle, "setheading") % 360
        self._emit("turn", h0=round(h0, 3), by=self._h - h0)

    def setposition(self, x, y=None):
        if y is None:
            x, y = x
        self._move_to(_num(x, "setposition"), _num(y, "setposition"))

    def setx(self, x):
        self._move_to(_num(x, "setx"), self._y)

    def sety(self, y):
        self._move_to(self._x, _num(y, "sety"))

    def home(self):
        self._move_to(0, 0)
        self.setheading(0)

    def circle(self, radius, extent=360, steps=None):
        radius = _num(radius, "circle")
        extent = _num(extent, "circle")
        if steps is None:
            steps = max(12, int(abs(extent) / 6))
        x0, y0, h0 = self._x, self._y, self._h
        # Center is to the left of the turtle for a positive radius.
        hr = math.radians(h0)
        cx = x0 - radius * math.sin(hr)
        cy = y0 + radius * math.cos(hr)
        pts = [[round(x0, 3), round(y0, 3)]]
        sign = 1 if radius >= 0 else -1
        for i in range(1, steps + 1):
            a = math.radians(extent * i / steps) * sign
            # rotate start point around center
            dx, dy = x0 - cx, y0 - cy
            px = cx + dx * math.cos(a) - dy * math.sin(a)
            py = cy + dx * math.sin(a) + dy * math.cos(a)
            pts.append([round(px, 3), round(py, 3)])
        self._x, self._y = pts[-1]
        self._h = (h0 + extent * sign) % 360
        if self._fillpts is not None:
            self._fillpts.extend(pts[1:])
        self._emit("circle", pts=pts, draw=self._pen, cx=round(cx, 3), cy=round(cy, 3),
                   r=radius, extent=extent)

    # ---- pen ----
    def penup(self):
        self._pen = False
        self._emit("pen")

    def pendown(self):
        self._pen = True
        self._emit("pen")

    def pensize(self, width=None):
        if width is None:
            return self._width
        self._width = _num(width, "pensize")
        self._emit("pen")

    def color(self, *args):
        if not args:
            return (self._color, self._fill)
        if len(args) == 1:
            self._color = self._fill = _color_value(args[0])
        elif len(args) == 2:
            self._color, self._fill = _color_value(args[0]), _color_value(args[1])
        else:
            self._color = self._fill = _color_value(args)
        self._emit("pen")

    def pencolor(self, c=None):
        if c is None:
            return self._color
        self._color = _color_value(c)
        self._emit("pen")

    def fillcolor(self, c=None):
        if c is None:
            return self._fill
        self._fill = _color_value(c)
        self._emit("pen")

    def begin_fill(self):
        self._fillpts = [[round(self._x, 3), round(self._y, 3)]]
        self._emit("begin_fill")

    def end_fill(self):
        pts = self._fillpts or []
        self._fillpts = None
        self._emit("fill", pts=pts, fillcolor=self._fill)

    def dot(self, size=None, color=None):
        size = self._width + 4 if size is None else _num(size, "dot")
        c = self._color if color is None else _color_value(color)
        self._emit("dot", size=size, dotcolor=c)

    def write(self, text, move=False, align="left", font=None):
        size = 12
        if isinstance(font, (tuple, list)) and len(font) > 1 and isinstance(font[1], (int, float)):
            size = font[1]
        self._emit("write", text=str(text), align=align, size=size)

    def clear(self):
        self._emit("clear")

    def hideturtle(self):
        self._visible = False
        self._emit("pen")

    def showturtle(self):
        self._visible = True
        self._emit("pen")

    def speed(self, s=None):
        return 0

    # ---- queries ----
    def position(self):
        return (round(self._x, 3), round(self._y, 3))

    def xcor(self):
        return round(self._x, 3)

    def ycor(self):
        return round(self._y, 3)

    def heading(self):
        return round(self._h, 3)

    def isdown(self):
        return self._pen

    def distance(self, x, y=None):
        if y is None:
            x, y = x
        return math.hypot(self._x - x, self._y - y)

    # aliases
    fd = forward
    bk = back = backward
    lt = left
    rt = right
    seth = setheading
    goto = setpos = setposition
    pu = up = penup
    pd = down = pendown
    width = pensize
    ht = hideturtle
    st = showturtle
    pos = position


class _Screen:
    def bgcolor(self, c):
        _cmds.append({"op": "bg", "line": _kid_line(), "bg": _color_value(c),
                      "after": _default._state()})

    def __getattr__(self, name):
        return lambda *a, **k: None


_screen = _Screen()


def Screen():
    return _screen


def bgcolor(c):
    _screen.bgcolor(c)


def done():
    pass


mainloop = exitonclick = tracer = update = done


_default = None
_EXPORTS = ["forward", "fd", "backward", "back", "bk", "left", "lt", "right", "rt",
            "setheading", "seth", "setposition", "setpos", "goto", "setx", "sety", "home",
            "circle", "penup", "pu", "up", "pendown", "pd", "down", "pensize", "width",
            "color", "pencolor", "fillcolor", "begin_fill", "end_fill", "dot", "write",
            "clear", "hideturtle", "ht", "showturtle", "st", "speed", "position", "pos",
            "xcor", "ycor", "heading", "isdown", "distance"]


_style = set()  # "global" and/or "object": which call style the program uses


def _global(method):
    def call(*args, **kwargs):
        _style.add("global")
        return method(*args, **kwargs)
    call.__name__ = method.__name__
    call.__doc__ = method.__doc__
    return call


def _reset():
    global _default
    _cmds.clear()
    _turtles.clear()
    _default = Turtle()
    _style.clear()
    g = globals()
    for name in _EXPORTS:
        g[name] = _global(getattr(_default, name))


_reset()

__all__ = _EXPORTS + ["Turtle", "Screen", "bgcolor", "done", "mainloop", "exitonclick"]
