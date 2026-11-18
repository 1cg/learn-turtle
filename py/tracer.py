"""Run kid code and record each step for the replay debugger."""
import io
import json
import sys
import traceback

import turtle as _t

KID = "<kid>"
MAX_STEPS = 20000
_HIDE = set(_t.__all__) | {"__builtins__", "__name__", "__doc__", "__spec__",
                           "__loader__", "__package__", "__annotations__"}


class StepLimit(Exception):
    pass


def _value(v, depth=0):
    """A small JSON view of a value for the variables panel."""
    if v is None or isinstance(v, (bool, int, str)):
        if isinstance(v, str) and len(v) > 200:
            return {"type": "str", "repr": repr(v[:200]) + "..."}
        return {"type": type(v).__name__, "repr": repr(v)}
    if isinstance(v, float):
        return {"type": "float", "repr": repr(round(v, 4))}
    if isinstance(v, (list, tuple)) and depth < 2:
        items = [_value(x, depth + 1) for x in v[:30]]
        return {"type": type(v).__name__, "repr": repr(v) if len(repr(v)) < 120 else None,
                "items": items, "len": len(v)}
    if isinstance(v, dict) and depth < 2:
        return {"type": "dict", "repr": repr(v) if len(repr(v)) < 120 else None, "len": len(v)}
    if callable(v) and hasattr(v, "__code__"):
        return {"type": "function", "repr": v.__name__ + "()",
                "def": v.__code__.co_firstlineno if v.__code__.co_filename == KID else None}
    if isinstance(v, _t.Turtle):
        return {"type": "Turtle", "repr": "Turtle #%d" % v._id}
    return {"type": type(v).__name__, "repr": "<" + type(v).__name__ + ">"}


def _frames(frame):
    out = []
    f = frame
    while f is not None and f.f_code.co_filename == KID:
        name = f.f_code.co_name
        if name == "<module>":
            src = f.f_globals
            name = "main program"
        else:
            src = f.f_locals
        vars_ = {}
        for k, v in list(src.items()):
            if k in _HIDE or k.startswith("_"):
                continue
            if type(v).__name__ == "module":
                continue
            vars_[k] = _value(v)
        out.append({"name": name, "line": f.f_lineno, "vars": vars_})
        f = f.f_back
    out.reverse()
    return out


def _error(exc, kind=None):
    line = 0
    if isinstance(exc, SyntaxError) and exc.filename == KID:
        line = exc.lineno or 0
    else:
        for fs in traceback.extract_tb(exc.__traceback__):
            if fs.filename == KID:
                line = fs.lineno
    return {"type": kind or type(exc).__name__, "msg": str(exc), "line": line}


def run(code):
    _t._reset()
    steps = []
    out = io.StringIO()
    g = {"__name__": "__main__"}
    exec("from turtle import *", g)

    def tracer(frame, event, arg):
        if frame.f_code.co_filename != KID:
            return None
        if event in ("line", "call", "return", "exception"):
            if len(steps) >= MAX_STEPS:
                raise StepLimit()
            step = {"event": event, "line": frame.f_lineno, "cmd": len(_t._cmds),
                    "out": out.tell(), "frames": _frames(frame)}
            if event == "return":
                step["ret"] = _value(arg)
                step["fn"] = frame.f_code.co_name
            if event == "call":
                step["fn"] = frame.f_code.co_name
            if event == "exception":
                step["exc"] = arg[0].__name__
            steps.append(step)
        return tracer

    error = None
    try:
        compiled = compile(code, KID, "exec")
    except SyntaxError as e:
        return json.dumps({"steps": [], "cmds": [], "out": "", "error": _error(e)})

    old_out = sys.stdout
    sys.stdout = out
    sys.settrace(tracer)
    try:
        exec(compiled, g)
    except StepLimit:
        error = {"type": "StepLimit", "msg": "too many steps",
                 "line": steps[-1]["line"] if steps else 0}
    except Exception as e:
        error = _error(e)
    finally:
        sys.settrace(None)
        sys.stdout = old_out
    # Steps for module return / exception noise at the end are fine to keep.
    try:
        import explain
        texts = explain.explain(code, steps, _t._cmds, out.getvalue())
    except Exception:
        texts = [None] * len(steps)
    for step, text in zip(steps, texts):
        step["say"] = text
    return json.dumps({"steps": steps, "cmds": _t._cmds, "out": out.getvalue(),
                       "error": error})
