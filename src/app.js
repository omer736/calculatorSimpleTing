(function () {
  "use strict";

  const display = document.getElementById("display");
  const history = document.getElementById("history");
  const keypad = document.getElementById("keypad");

  let state = Calculator.createState();

  function render() {
    display.textContent = state.current;
    history.textContent = Calculator.historyText(state);
  }

  function handleAction(action) {
    switch (action) {
      case "clear":
        state = Calculator.clear();
        break;
      case "sign":
        state = Calculator.toggleSign(state);
        break;
      case "percent":
        state = Calculator.percent(state);
        break;
      case "decimal":
        state = Calculator.inputDecimal(state);
        break;
      case "delete":
        state = Calculator.deleteLast(state);
        break;
      case "equals":
        state = Calculator.equals(state);
        break;
      default:
        return;
    }
    render();
  }

  keypad.addEventListener("click", function (event) {
    const key = event.target.closest(".key");
    if (!key) {
      return;
    }

    if (key.dataset.digit) {
      state = Calculator.inputDigit(state, key.dataset.digit);
      render();
    } else if (key.dataset.op) {
      state = Calculator.chooseOperator(state, key.dataset.op);
      render();
    } else if (key.dataset.action) {
      handleAction(key.dataset.action);
    }
  });

  // --- keyboard support -----------------------------------------------

  const KEY_ACTIONS = {
    Enter: "equals",
    "=": "equals",
    Escape: "clear",
    c: "clear",
    C: "clear",
    Backspace: "delete",
    ".": "decimal",
    ",": "decimal",
    "%": "percent",
  };

  function flash(selector) {
    const key = keypad.querySelector(selector);
    if (!key) {
      return;
    }
    key.classList.add("is-pressed");
    setTimeout(function () {
      key.classList.remove("is-pressed");
    }, 90);
  }

  document.addEventListener("keydown", function (event) {
    const { key } = event;

    if (key >= "0" && key <= "9") {
      state = Calculator.inputDigit(state, key);
      render();
      flash('[data-digit="' + key + '"]');
      return;
    }

    if (["+", "-", "*", "/"].includes(key)) {
      state = Calculator.chooseOperator(state, key);
      render();
      flash('[data-op="' + key + '"]');
      return;
    }

    const action = KEY_ACTIONS[key];
    if (action) {
      event.preventDefault();
      handleAction(action);
      flash('[data-action="' + action + '"]');
    }
  });

  render();
})();
