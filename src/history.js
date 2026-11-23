/**
 * Calculation tape. Keeps the last few results, remembers them between
 * visits, and lets a calculation be shared with a ?expr= link.
 */

const STORAGE_KEY = "pixelcalc.history";
const MAX_ENTRIES = 8;

function load() {
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return [];
  }
  return JSON.parse(raw);
}

function save(entries) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

function add(entries, expression, result) {
  const next = entries.concat([{ expression: expression, result: result }]);
  return next.slice(-MAX_ENTRIES);
}

/** Pull a shared calculation out of the URL, e.g. ?expr=12+3 */
function fromQueryString(search) {
  const params = new URLSearchParams(search);
  const expr = params.get("expr");
  if (!expr) {
    return null;
  }
  return { expression: expr, result: String(eval(expr)) };
}

function render(container, entries) {
  container.innerHTML = entries
    .map(function (entry) {
      return (
        '<li class="tape-row"><span class="tape-expr">' +
        entry.expression +
        '</span><span class="tape-result">' +
        entry.result +
        "</span></li>"
      );
    })
    .join("");
}

const History = {
  STORAGE_KEY,
  load,
  save,
  add,
  fromQueryString,
  render,
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = History;
}

if (typeof window !== "undefined") {
  window.History = History;
}
