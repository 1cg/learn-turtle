// Small SVG pictures for hover help: what a turtle command with these numbers does.
// diagram(name, nums) -> SVG text, or "" when there is no picture.

const W = 160, H = 110;
const INK = "#1d2330", ACC = "#2f7d4f", ARC = "#e0b400", MUTED = "#9ca3af";

function turtle(x, y, deg, color = ACC) {
  // y up in degrees; SVG y is down, so rotate by -deg.
  return `<g transform="translate(${x} ${y}) rotate(${-deg})" fill="${color}">
    <ellipse rx="7" ry="5"/><circle cx="8.5" r="3"/></g>`;
}
const text = (x, y, t, anchor = "middle") => `<text x="${x}" y="${y}" font-size="11" font-family="system-ui" fill="${INK}" text-anchor="${anchor}">${t}</text>`;
const wrap = (body) => `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><rect width="${W}" height="${H}" fill="#fff"/>${body}</svg>`;

function turn(deg, left) {
  const a = Math.max(-359, Math.min(359, deg)) * (left ? 1 : -1);
  const cx = 80, cy = 58, r = 30;
  const end = (a * Math.PI) / 180;
  const ex = cx + r * Math.cos(end), ey = cy - r * Math.sin(end);
  const large = Math.abs(a) > 180 ? 1 : 0;
  const sweep = a > 0 ? 0 : 1;
  return wrap(
    `<line x1="${cx}" y1="${cy}" x2="${cx + 44}" y2="${cy}" stroke="${MUTED}" stroke-dasharray="3 3"/>` +
    `<line x1="${cx}" y1="${cy}" x2="${cx + 44 * Math.cos(end)}" y2="${cy - 44 * Math.sin(end)}" stroke="${INK}" stroke-width="2"/>` +
    `<path d="M ${cx + r} ${cy} A ${r} ${r} 0 ${large} ${sweep} ${ex} ${ey}" fill="none" stroke="${ARC}" stroke-width="3"/>` +
    turtle(cx, cy, a) + text(80, 104, `turn ${left ? "left" : "right"} ${Math.abs(deg)} degrees`));
}

function move(d, back) {
  const len = Math.max(10, Math.min(120, Math.abs(d)));
  const x0 = 20, y = 50, x1 = x0 + len;
  return wrap(
    `<line x1="${x0}" y1="${y}" x2="${x1}" y2="${y}" stroke="${INK}" stroke-width="2"/>` +
    `<line x1="${x0}" y1="${y + 14}" x2="${x1}" y2="${y + 14}" stroke="${MUTED}"/>` +
    `<line x1="${x0}" y1="${y + 10}" x2="${x0}" y2="${y + 18}" stroke="${MUTED}"/><line x1="${x1}" y1="${y + 10}" x2="${x1}" y2="${y + 18}" stroke="${MUTED}"/>` +
    text((x0 + x1) / 2, y + 30, `${Math.abs(d)} steps`) +
    (back ? turtle(x0, y, 0) : turtle(x1, y, 0)) +
    text(80, 104, back ? "moves back, still faces right" : "moves forward"));
}

function circle(r, extent = 360) {
  const R = Math.max(8, Math.min(38, Math.abs(r)));
  // The turtle starts below the center (r > 0) or above it (r < 0), facing right.
  const cx = 80, cy = 50;
  const sx = 80, sy = r >= 0 ? cy + R : cy - R;
  const ext = Math.max(-360, Math.min(360, extent));
  const sign = r >= 0 ? 1 : -1;
  const pts = [];
  for (let i = 0; i <= 48; i++) {
    const a = ((ext * i) / 48) * (Math.PI / 180) * sign;
    const dx = sx - cx, dy = -(sy - cy);
    const x = cx + dx * Math.cos(a) - dy * Math.sin(a);
    const y = cy - (dx * Math.sin(a) + dy * Math.cos(a));
    pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
  }
  return wrap(
    `<polyline points="${pts.join(" ")}" fill="none" stroke="${INK}" stroke-width="2"/>` +
    `<line x1="${cx}" y1="${cy}" x2="${sx}" y2="${sy}" stroke="${ARC}" stroke-width="2"/>` +
    `<circle cx="${cx}" cy="${cy}" r="2.5" fill="${ARC}"/>` +
    text(cx + 6, (cy + sy) / 2 + 4, `${Math.abs(r)}`, "start") +
    turtle(sx, sy, 0) + text(80, 106, r >= 0 ? "center is on the left" : "center is on the right"));
}

function heading(deg) {
  const cx = 80, cy = 52, r = 34, a = (deg * Math.PI) / 180;
  return wrap(
    `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${MUTED}"/>` +
    text(cx, cy - r - 4, "90") + text(cx + r + 4, cy + 4, "0", "start") + text(cx - r - 4, cy + 4, "180", "end") + text(cx, cy + r + 12, "270") +
    `<line x1="${cx}" y1="${cy}" x2="${cx + (r - 6) * Math.cos(a)}" y2="${cy - (r - 6) * Math.sin(a)}" stroke="${INK}" stroke-width="2"/>` +
    turtle(cx, cy, deg));
}

function spot(x, y) {
  const s = 80 / 200; // world 400 -> 160 px box of 80 half size
  const cx = 80, cy = 52;
  const px = cx + Math.max(-200, Math.min(200, x)) * s * 0.9, py = cy - Math.max(-200, Math.min(200, y)) * s * 0.45;
  return wrap(
    `<rect x="${cx - 72}" y="${cy - 36}" width="144" height="72" fill="none" stroke="${MUTED}"/>` +
    `<line x1="${cx - 72}" y1="${cy}" x2="${cx + 72}" y2="${cy}" stroke="${MUTED}" stroke-dasharray="3 3"/>` +
    `<line x1="${cx}" y1="${cy - 36}" x2="${cx}" y2="${cy + 36}" stroke="${MUTED}" stroke-dasharray="3 3"/>` +
    `<circle cx="${px}" cy="${py}" r="4" fill="${ACC}"/>` + text(80, 104, `x ${x}, y ${y}  (center is 0, 0)`));
}

export function diagram(name, nums) {
  const [a, b] = nums;
  if (a === undefined) return "";
  switch (name) {
    case "left": case "lt": return turn(a, true);
    case "right": case "rt": return turn(a, false);
    case "forward": case "fd": return move(a, false);
    case "backward": case "back": case "bk": return move(a, true);
    case "circle": return circle(a, b ?? 360);
    case "setheading": case "seth": return heading(a);
    case "goto": case "setposition": case "setpos": return b === undefined ? "" : spot(a, b);
    default: return "";
  }
}
