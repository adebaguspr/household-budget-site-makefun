// Dompet Rumah — household budget data. Figures are labelled with source
// and year wherever they appear; worked examples are marked as examples.
const META = {
  site: "Dompet Rumah",
  tagline: "A household budget that adds up",
  updated: "November 2026",
};

// The worked example household: two incomes, two children, Jakarta.
// Marked as an example on every page that shows it.
const EXAMPLE_HOUSEHOLD = {
  name: "The Hartono family, Jakarta",
  members: "2 adults, 2 children",
  income: 12500000,
  note: "Worked example — change the income in the planner to see your own numbers.",
};

const EXAMPLE_PLAN = [
  { category: "Housing & utilities", amount: 2800000, group: "needs" },
  { category: "Food & groceries", amount: 2200000, group: "needs" },
  { category: "Transport", amount: 900000, group: "needs" },
  { category: "School & childcare", amount: 800000, group: "needs" },
  { category: "Health", amount: 200000, group: "needs" },
  { category: "Eating out & fun", amount: 1200000, group: "wants" },
  { category: "Clothes & personal", amount: 800000, group: "wants" },
  { category: "Streaming & hobbies", amount: 400000, group: "wants" },
  { category: "Family outings", amount: 700000, group: "wants" },
  { category: "Emergency fund", amount: 1000000, group: "savings" },
  { category: "Children's education fund", amount: 900000, group: "savings" },
  { category: "Extra debt payment", amount: 600000, group: "savings" },
];

// 50/30/20 rule targets (Elizabeth Warren, "All Your Worth"): needs 50%,
// wants 30%, savings & debt 20%.
const RULE_503020 = [
  { group: "needs", label: "Needs", target: 50, colour: "#0f766e" },
  { group: "wants", label: "Wants", target: 30, colour: "#b45309" },
  { group: "savings", label: "Savings & debt", target: 20, colour: "#1d4ed8" },
];

const SEED_EXPENSES = [
  { date: "2026-11-02", what: "Weekly groceries — pasar", category: "Food & groceries", amount: 385000 },
  { date: "2026-11-05", what: "Electricity token (PLN)", category: "Housing & utilities", amount: 300000 },
  { date: "2026-11-08", what: "School books — Ayu", category: "School & childcare", amount: 240000 },
  { date: "2026-11-11", what: "Petrol — motor", category: "Transport", amount: 100000 },
  { date: "2026-11-14", what: "Family dinner out", category: "Eating out & fun", amount: 275000 },
  { date: "2026-11-18", what: "Internet bill", category: "Housing & utilities", amount: 350000 },
  { date: "2026-11-21", what: "Weekly groceries — supermarket", category: "Food & groceries", amount: 420000 },
  { date: "2026-11-24", what: "Cinema — two tickets", category: "Eating out & fun", amount: 110000 },
];

const SAMPLE_BUDGETS = [
  { income: 5396761, label: "One UMP Jakarta salary (2025)", note: "Minimum wage DKI Jakarta 2025: Rp 5.396.761/month (Pemprov DKI)." },
  { income: 8500000, label: "Two incomes, modest", note: "Example: Rp 5,4 jt + Rp 3,1 jt." },
  { income: 12500000, label: "The Hartono family", note: "The worked example used across this site." },
];

const GUIDES = [
  { title: "Start with one month of tracking", body: "Before any budget works, write down everything the household spends for one month — every coffee, every ojek. Most families find 10–20% they did not know they spent." },
  { title: "Pay the emergency fund first", body: "Move savings out on payday, before spending starts. Aim for 3 months of essential expenses, then 6. A Rp 500.000 monthly transfer reaches Rp 6.000.000 in a year." },
  { title: "Envelopes beat willpower", body: "Give each category its own limit — cash in envelopes, or a separate account per category. When an envelope is empty, spending in that category stops until next month." },
  { title: "Review together, monthly", body: "A budget fails quietly when only one person watches it. Sit down for 20 minutes at month's end: what went over, what went under, and one change for next month." },
];

const FACTS = [
  { label: "Minimum wage, Jakarta 2025", value: "Rp 5.396.761", sub: "per month · UMP DKI Jakarta 2025", source: "Pemprov DKI Jakarta, 2025" },
  { label: "Inflation 2024", value: "1.57%", sub: "consumer prices, year on year", source: "BPS, 2024" },
  { label: "50/30/20 rule", value: "50 · 30 · 20", sub: "needs · wants · savings", source: "Warren & Tyagi, All Your Worth" },
  { label: "Emergency fund target", value: "3–6 months", sub: "of essential monthly expenses", source: "OJK financial planning guidance" },
];

const SOURCES = [
  { figure: "UMP DKI Jakarta 2025", source: "Pemprov DKI Jakarta — Governor's Decree on the 2025 provincial minimum wage", note: "Rp 5.396.761 per month." },
  { figure: "Inflation 2024 (1.57%)", source: "BPS — Statistics Indonesia, consumer price index", note: "Year-on-year CPI inflation, 2024." },
  { figure: "50/30/20 rule", source: "Elizabeth Warren & Amelia Warren Tyagi, All Your Worth (2005)", note: "A budgeting rule of thumb: 50% needs, 30% wants, 20% savings and debt repayment." },
  { figure: "Emergency fund 3–6 months", source: "OJK (Financial Services Authority) financial planning guidance", note: "The standard recommendation for households." },
  { figure: "Worked example household", source: "Illustrative example made for this site", note: "Not statistics — an example to show how the tools work. Your numbers go in the planner." },
];
