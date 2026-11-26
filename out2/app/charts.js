// Charts for Dompet Rumah: horizontal bars and a 50/30/20 donut.
// Plain SVG, drawn from the numbers in data.js — no libraries, no network.
function fmt(n) {
  return "Rp " + Math.round(n).toLocaleString("en-US").replace(/,/g, ".");
}

function donut(parts, size) {
  const r = 70;
  const c = 2 * Math.PI * r;
  const total = parts.reduce((s, p) => s + p.value, 0) || 1;
  let offset = 0;
  const segs = parts
    .map((p) => {
      const frac = p.value / total;
      const dash = `${(frac * c).toFixed(1)} ${(c - frac * c).toFixed(1)}`;
      const el = `<circle cx="100" cy="100" r="${r}" fill="none" stroke="${p.colour}" stroke-width="26" stroke-dasharray="${dash}" stroke-dashoffset="${(-offset).toFixed(1)}" transform="rotate(-90 100 100)"/>`;
      offset += frac * c;
      return el;
    })
    .join("");
  const legend = parts
    .map(
      (p) =>
        `<div class="legend-row"><span class="dot" style="background:${p.colour}"></span>${p.label}<b>${((p.value / total) * 100).toFixed(0)}%</b></div>`,
    )
    .join("");
  return `<div class="donut-wrap"><svg viewBox="0 0 200 200" width="${size || 200}" height="${size || 200}" role="img" aria-label="Budget split chart">${segs}<text x="100" y="96" text-anchor="middle" font-size="15" fill="#64748b">per month</text><text x="100" y="118" text-anchor="middle" font-size="17" font-weight="700" fill="#1e293b">${fmt(total)}</text></svg><div class="legend">${legend}</div></div>`;
}

function catBars(rows) {
  const max = Math.max.apply(null, rows.map((r) => r.amount));
  return rows
    .map(
      (r) => `<div class="hbar-row"><span class="hbar-label">${r.category}</span>
      <span class="hbar-track"><span class="hbar-fill" style="width:${((r.amount / max) * 100).toFixed(1)}%;background:${r.colour || "#0f766e"}"></span></span>
      <span class="hbar-value">${fmt(r.amount)}</span></div>`,
    )
    .join("");
}

function groupTotals(plan) {
  const groups = {};
  plan.forEach((p) => {
    groups[p.group] = (groups[p.group] || 0) + p.amount;
  });
  return groups;
}
