const test = require("node:test");
const assert = require("node:assert");

const Calculator = require("../src/calculator.js");

function press(state, keys) {
  return keys.reduce(function (acc, key) {
    if (/^[0-9]$/.test(key)) {
      return Calculator.inputDigit(acc, key);
    }
    if (["+", "-", "*", "/"].includes(key)) {
      return Calculator.chooseOperator(acc, key);
    }
    if (key === ".") {
      return Calculator.inputDecimal(acc);
    }
    if (key === "=") {
      return Calculator.equals(acc);
    }
    throw new Error("unknown key: " + key);
  }, state);
}

test("adds two numbers", function () {
  const state = press(Calculator.createState(), ["1", "2", "+", "3", "="]);
  assert.strictEqual(state.current, "15");
});

test("chains operations without pressing equals", function () {
  const state = press(Calculator.createState(), ["2", "+", "3", "*", "4", "="]);
  assert.strictEqual(state.current, "20");
});

test("keeps a single decimal point", function () {
  let state = Calculator.inputDigit(Calculator.createState(), "1");
  state = Calculator.inputDecimal(state);
  state = Calculator.inputDecimal(state);
  state = Calculator.inputDigit(state, "5");
  assert.strictEqual(state.current, "1.5");
});

test("division by zero shows an error", function () {
  const state = press(Calculator.createState(), ["8", "/", "0", "="]);
  assert.strictEqual(state.current, "ERR");
});

test("percent divides by one hundred", function () {
  const state = Calculator.percent(press(Calculator.createState(), ["5", "0"]));
  assert.strictEqual(state.current, "0.5");
});

test("toggles the sign", function () {
  const state = Calculator.toggleSign(press(Calculator.createState(), ["7"]));
  assert.strictEqual(state.current, "-7");
});

test("trims floating point noise", function () {
  const state = press(Calculator.createState(), ["0", ".", "1", "+", "0", ".", "2", "="]);
  assert.strictEqual(state.current, "0.3");
});

test("clear resets everything", function () {
  const state = Calculator.clear();
  assert.deepStrictEqual(state, {
    current: "0",
    previous: null,
    operator: null,
    overwrite: false,
  });
});
