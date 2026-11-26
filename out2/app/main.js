// Router: hash routes (#/, #/planner, #/tracker, #/guides, #/sources).
// Renders the matching view into #app, marks the active nav link, scrolls
// to the top, then wires up the view's own controls (planner inputs,
// tracker form) — innerHTML never runs script tags, so this is where the
// interactive views get their behaviour.
const NAV = [
  { path: "#/", label: "Dashboard" },
  { path: "#/planner", label: "Planner" },
  { path: "#/tracker", label: "Tracker" },
  { path: "#/guides", label: "Guides" },
  { path: "#/sources", label: "Sources" },
];

function route() {
  const hash = window.location.hash || "#/";
  const path = hash.slice(1) || "/";
  return VIEWS[path] ? path : "/";
}

function render() {
  const path = route();
  const app = document.getElementById("app");
  app.innerHTML = VIEWS[path]();
  document.querySelectorAll("nav a").forEach((a) => {
    a.classList.toggle("active", a.getAttribute("href") === `#${path}`);
  });
  if (path === "/planner") initPlanner(EXAMPLE_HOUSEHOLD.income);
  if (path === "/tracker") initTracker();
  window.scrollTo(0, 0);
}

function buildNav() {
  const nav = document.getElementById("nav");
  nav.innerHTML = NAV.map((n) => `<a href="${n.path}">${n.label}</a>`).join("");
}

buildNav();
window.addEventListener("hashchange", render);
render();
