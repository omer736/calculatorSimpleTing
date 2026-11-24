/**
 * Pure calculator state machine. No DOM in here, so it can be unit tested.
 *
 * State shape:
 *   current   - string shown on the display
 *   previous  - stored operand (string) or null
 *   operator  - pending operator ('+', '-', '*', '/') or null
 *   overwrite - true when the next digit should replace the display
 */

const MAX_DIGITS = 12;

function createState() {
  return {
    current: "0",
    previous: null,
    operator: null,
    overwrite: false,
  };
}

function applyOperation(a, b, operator) {
  switch (operator) {
    case "+":
      return a + b;
    case "-":
      return a - b;
    case "*":
      return a * b;
    case "/":
      if (b === 0) {
        return null;
      }
      return a / b;
    default:
      return b;
  }
}

/** Trim floating point noise and keep the display a sane width. */
function formatResult(value) {
  if (value === null || !Number.isFinite(value)) {
    return "ERR";
  }

  const rounded = Number(value.toPrecision(MAX_DIGITS));

  if (Math.abs(rounded) >= 1e12 || (rounded !== 0 && Math.abs(rounded) < 1e-9)) {
    return rounded.toExponential(6);
  }

  return String(rounded);
}

function inputDigit(state, digit) {
  if (state.current === "ERR" || state.overwrite) {
    return { ...state, current: digit, overwrite: false };
  }

  if (state.current === "0") {
    return { ...state, current: digit };
  }

  if (state.current.replace(/[-.]/g, "").length >= MAX_DIGITS) {
    return state;
  }

  return { ...state, current: state.current + digit };
}

function inputDecimal(state) {
  if (state.current === "ERR" || state.overwrite) {
    return { ...state, current: "0.", overwrite: false };
  }

  if (state.current.includes(".")) {
    return state;
  }

  return { ...state, current: state.current + "." };
}

function chooseOperator(state, operator) {
  if (state.current === "ERR") {
    return state;
  }

  // Swap the pending operator when the user has not typed a new operand yet.
  if (state.operator !== null && state.overwrite) {
    return { ...state, operator };
  }

  if (state.previous === null) {
    return {
      ...state,
      previous: state.current,
      operator,
      overwrite: true,
    };
  }

  const result = applyOperation(
    parseFloat(state.previous),
    parseFloat(state.current),
    state.operator,
  );
  const formatted = formatResult(result);

  return {
    current: formatted,
    previous: formatted === "ERR" ? null : formatted,
    operator: formatted === "ERR" ? null : operator,
    overwrite: true,
  };
}

function equals(state) {
  if (state.operator === null || state.previous === null) {
    return state;
  }

  const result = applyOperation(
    parseFloat(state.previous),
    parseFloat(state.current),
    state.operator,
  );

  return {
    current: formatResult(result),
    previous: null,
    operator: null,
    overwrite: true,
  };
}

function toggleSign(state) {
  if (state.current === "ERR" || state.current === "0") {
    return state;
  }

  const current = state.current.startsWith("-")
    ? state.current.slice(1)
    : "-" + state.current;

  return { ...state, current };
}

/** Remove the last character the user typed. */
function deleteLast(state) {
  if (state.current === "ERR") {
    return createState();
  }

  const current = state.current.slice(0, -1);
  return {
    ...state,
    current: current === "" || current === "-" ? "0" : current,
    overwrite: state.operator !== null && state.overwrite,
  };
}

function percent(state) {
  if (state.current === "ERR") {
    return state;
  }

  return { ...state, current: formatResult(parseFloat(state.current) / 100) };
}

function clear() {
  return createState();
}

/** Text shown above the display, e.g. "12 x". */
function historyText(state) {
  if (state.previous === null || state.operator === null) {
    return "";
  }

  const symbols = { "+": "+", "-": "-", "*": "x", "/": "/" };
  return `${state.previous} ${symbols[state.operator]}`;
}

const Calculator = {
  createState,
  applyOperation,
  formatResult,
  inputDigit,
  inputDecimal,
  deleteLast,
  chooseOperator,
  equals,
  toggleSign,
  percent,
  clear,
  historyText,
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = Calculator;
}

if (typeof window !== "undefined") {
  window.Calculator = Calculator;
}
