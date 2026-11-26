// Views for Dompet Rumah. Routes: #/ dashboard, #/planner, #/tracker,
// #/guides, #/sources. The tracker stores expenses in localStorage; the
// planner recomputes live from the income and split the visitor types in.
const LS_KEY = "dompet-rumah-expenses-v1";

function fmt(n) {
  return "Rp " + Math.round(n).toLocaleString("en-US").replace(/,/g, ".");
}

function loadExpenses() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) { /* fresh start below */ }
  return SEED_EXPENSES.slice();
}

function saveExpenses(list) {
  try { localStorage.setItem(LS_KEY, JSON.stringify(list)); } catch (e) { /* private mode */ }
}

function planGroups() {
  const groups = { needs: 0, wants: 0, savings: 0 };
  EXAMPLE_PLAN.forEach((p) => { groups[p.group] += p.amount; });
  return groups;
}

function kpiCards(items) {
  return `<div class="kpis">${items.map((k) => `<div class="kpi"><div class="kpi-value">${k.value}</div>
    <div class="kpi-label">${k.label}</div><div class="kpi-sub">${k.sub}</div>
    <div class="kpi-src">${k.source}</div></div>`).join("")}</div>`;
}

function section(title, intro, body) {
  return `<section><h2>${title}</h2><p class="intro">${intro}</p>${body}</section>`;
}

function srcNote(text) {
  return `<p class="src-note">Source: ${text}</p>`;
}

function viewDashboard() {
  const income = EXAMPLE_HOUSEHOLD.income;
  const groups = planGroups();
  const planned = groups.needs + groups.wants + groups.savings;
  const left = income - planned;
  const parts = RULE_503020.map((r) => ({ label: r.label, value: groups[r.group], colour: r.colour }));
  const spent = loadExpenses().reduce((s, e) => s + e.amount, 0);
  return `
  <header class="hero"><p class="eyebrow">Household budget · Jakarta</p>
  <h1>Dompet Rumah</h1>
  <p class="lede">A household budget that adds up: plan the month, track what actually
  leaves the wallet, and keep savings moving first. Worked example below —
  your numbers go in the planner.</p></header>
  ${kpiCards([
    { label: "Monthly income", value: fmt(income), sub: EXAMPLE_HOUSEHOLD.name + " · " + EXAMPLE_HOUSEHOLD.members, source: "Worked example" },
    { label: "Planned spending", value: fmt(planned), sub: fmt(left) + " left unallocated", source: "Example plan" },
    { label: "Tracked so far (Nov)", value: fmt(spent), sub: loadExpenses().length + " expenses logged", source: "Your tracker" },
    { label: "Savings rate", value: Math.round((groups.savings / income) * 100) + "%", sub: "target 20% · 50/30/20 rule", source: "Warren & Tyagi" },
  ])}
  ${section("Where the month goes", "The example household's plan, split by the 50/30/20 rule. Needs 55%, wants 25%, savings 20% — needs run 5 points over the 50% target, so the planner flags it.",
    donut(parts, 200) + srcNote("Worked example plan, November 2026."))}
  ${section("Biggest categories", "Planned spending by category, largest first.",
    `<div class="hbars">${catBars(EXAMPLE_PLAN.slice().sort((a, b) => b.amount - a.amount).slice(0, 6).map((p) => ({ category: p.category, amount: p.amount, colour: RULE_503020.find((r) => r.group === p.group).colour })))}</div>` + srcNote("Worked example plan."))}
  ${section("Three households, three budgets", "The same 50/30/20 split applied to three incomes — including one Jakarta minimum wage.",
    `<table><thead><tr><th>Household</th><th>Income</th><th>Needs 50%</th><th>Wants 30%</th><th>Savings 20%</th></tr></thead><tbody>
    ${SAMPLE_BUDGETS.map((s) => `<tr><td>${s.label}</td><td>${fmt(s.income)}</td><td>${fmt(s.income * 0.5)}</td><td>${fmt(s.income * 0.3)}</td><td>${fmt(s.income * 0.2)}</td></tr>`).join("")}
    </tbody></table>` + srcNote("UMP DKI Jakarta 2025: Rp 5.396.761 (Pemprov DKI). Other rows are worked examples."))}`;
}

function viewPlanner() {
  const income = EXAMPLE_HOUSEHOLD.income;
  const groups = planGroups();
  return `
  <header class="hero"><p class="eyebrow">Planner</p>
  <h1>Plan your month</h1>
  <p class="lede">Type your household income, then set the split. The planner shows the
  rupiah for each bucket and how it compares with the 50/30/20 rule.</p></header>
  <section><div class="planner-box">
    <label>Monthly household income (Rp)<input id="pl-income" type="number" min="0" step="50000" value="${income}"></label>
    <div class="split-row">
      <label>Needs %<input id="pl-needs" type="number" min="0" max="100" value="50"></label>
      <label>Wants %<input id="pl-wants" type="number" min="0" max="100" value="30"></label>
      <label>Savings %<input id="pl-sav" type="number" min="0" max="100" value="20"></label>
    </div>
    <p id="pl-sum" class="pl-sum"></p>
    <div id="pl-out"></div>
  </div></section>
  ${section("The example plan, line by line", "What the Hartono family plans to spend, November 2026.",
    `<table><thead><tr><th>Category</th><th>Bucket</th><th>Amount</th></tr></thead><tbody>
    ${EXAMPLE_PLAN.map((p) => `<tr><td>${p.category}</td><td>${RULE_503020.find((r) => r.group === p.group).label}</td><td>${fmt(p.amount)}</td></tr>`).join("")}
    <tr><td><b>Total planned</b></td><td></td><td><b>${fmt(EXAMPLE_PLAN.reduce((s, p) => s + p.amount, 0))}</b></td></tr>
    </tbody></table>` + srcNote("Worked example."))}`;
}

function initPlanner(fallbackIncome) {
  const read = () => ({
    income: Math.max(0, Number(document.getElementById("pl-income").value) || 0),
    needs: Number(document.getElementById("pl-needs").value) || 0,
    wants: Number(document.getElementById("pl-wants").value) || 0,
    sav: Number(document.getElementById("pl-sav").value) || 0,
  });
  const draw = () => {
    const v = read();
    const sum = v.needs + v.wants + v.sav;
    const sumEl = document.getElementById("pl-sum");
    sumEl.textContent = sum === 100 ? "Split adds up to 100% — good." : "Split adds up to " + sum + "% — it must total 100%.";
    sumEl.className = "pl-sum " + (sum === 100 ? "ok" : "bad");
    const rows = [
      { label: "Needs", pct: v.needs, target: 50, colour: "#0f766e" },
      { label: "Wants", pct: v.wants, target: 30, colour: "#b45309" },
      { label: "Savings & debt", pct: v.sav, target: 20, colour: "#1d4ed8" },
    ];
    document.getElementById("pl-out").innerHTML = rows.map((r) => {
      const diff = r.pct - r.target;
      const verdict = diff === 0 ? "on target" : diff > 0 ? diff + " pts over the " + r.target + "% rule" : Math.abs(diff) + " pts under the " + r.target + "% rule";
      return `<div class="hbar-row"><span class="hbar-label">${r.label}</span>
        <span class="hbar-track"><span class="hbar-fill" style="width:${Math.min(100, r.pct)}%;background:${r.colour}"></span></span>
        <span class="hbar-value">${fmt(v.income * r.pct / 100)}</span></div>
        <p class="verdict">${r.label}: ${r.pct}% — ${verdict}.</p>`;
    }).join("");
  };
  ["pl-income", "pl-needs", "pl-wants", "pl-sav"].forEach((id) => {
    document.getElementById(id).addEventListener("input", draw);
  });
  draw();
}

function viewTracker() {
  const list = loadExpenses();
  const byCat = {};
  list.forEach((e) => { byCat[e.category] = (byCat[e.category] || 0) + e.amount; });
  const total = list.reduce((s, e) => s + e.amount, 0);
  const cats = EXAMPLE_PLAN.map((p) => p.category).filter((c, i, a) => a.indexOf(c) === i);
  return `
  <header class="hero"><p class="eyebrow">Tracker</p>
  <h1>Track every rupiah</h1>
  <p class="lede">Log spending as it happens. The list and the totals update at once, and
  entries are saved in this browser — come back tomorrow and they are still here.</p></header>
  <section><form id="ex-form" class="ex-form">
    <label>Date<input id="ex-date" type="date" value="2026-11-26" required></label>
    <label>What<input id="ex-what" type="text" placeholder="e.g. Weekly groceries" required></label>
    <label>Category<select id="ex-cat">${cats.map((c) => `<option>${c}</option>`).join("")}</select></label>
    <label>Amount (Rp)<input id="ex-amount" type="number" min="1000" step="1000" placeholder="150000" required></label>
    <button type="submit">Add expense</button>
  </form></section>
  ${section("November so far", total ? fmt(total) + " across " + list.length + " expenses." : "No expenses logged yet.",
    `<table><thead><tr><th>Date</th><th>What</th><th>Category</th><th>Amount</th><th></th></tr></thead><tbody>
    ${list.slice().reverse().map((e, ri) => `<tr><td>${e.date}</td><td>${e.what}</td><td>${e.category}</td><td>${fmt(e.amount)}</td><td><button class="del" data-i="${list.length - 1 - ri}">Delete</button></td></tr>`).join("")}
    </tbody></table>`)}
  ${section("By category", "Where the tracked money went.",
    `<div class="hbars">${catBars(Object.keys(byCat).sort((a, b) => byCat[b] - byCat[a]).map((c) => ({ category: c, amount: byCat[c] })))}</div>`)}`;
}

function initTracker() {
  document.getElementById("ex-form").addEventListener("submit", (ev) => {
    ev.preventDefault();
    const list = loadExpenses();
    list.push({
      date: document.getElementById("ex-date").value,
      what: document.getElementById("ex-what").value.trim(),
      category: document.getElementById("ex-cat").value,
      amount: Number(document.getElementById("ex-amount").value),
    });
    saveExpenses(list);
    render();
  });
  document.querySelectorAll(".del").forEach((b) => {
    b.addEventListener("click", () => {
      const list = loadExpenses();
      list.splice(Number(b.getAttribute("data-i")), 1);
      saveExpenses(list);
      render();
    });
  });
}

function viewGuides() {
  return `
  <header class="hero"><p class="eyebrow">Guides</p>
  <h1>Four habits that hold a budget together</h1>
  <p class="lede">Tools help, but habits keep the money. Four practices, each small enough
  to start this week.</p></header>
  ${GUIDES.map((g) => `<section><h2>${g.title}</h2><p>${g.body}</p></section>`).join("")}
  ${section("Know your numbers", "The reference figures this site uses.",
    `<div class="kpis">${FACTS.map((f) => `<div class="kpi"><div class="kpi-value">${f.value}</div>
    <div class="kpi-label">${f.label}</div><div class="kpi-sub">${f.sub}</div>
    <div class="kpi-src">${f.source}</div></div>`).join("")}</div>` + srcNote("See Sources for the full list."))}`;
}

function viewSources() {
  return `
  <header class="hero"><p class="eyebrow">Sources &amp; methods</p>
  <h1>Where every figure comes from</h1>
  <p class="lede">Statistics are sourced and dated; worked examples are labelled as
  examples, never passed off as data.</p></header>
  ${SOURCES.map((s) => `<section><h2>${s.figure}</h2><p>${s.source}</p><p class="src-note">${s.note}</p></section>`).join("")}
  <section><h2>Method notes</h2>
  <p>The planner and tracker run entirely in your browser: nothing is sent anywhere, and expenses are stored only in this browser's local storage. The 50/30/20 split is a rule of thumb, not a law — a household with high rent will run needs above 50%, and the planner says so rather than pretending otherwise.</p></section>`;
}

const VIEWS = {
  "/": viewDashboard,
  "/planner": viewPlanner,
  "/tracker": viewTracker,
  "/guides": viewGuides,
  "/sources": viewSources,
};
