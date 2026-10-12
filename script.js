const display = document.getElementById("display");
const buttons = document.querySelectorAll(".btn");

let currentInput = "0";
let firstOperand = null;
let operator = null;
let shouldResetDisplay = false;

function updateDisplay() {
  display.value = currentInput;
}

function inputNumber(num) {
  if (shouldResetDisplay) {
    currentInput = num;
    shouldResetDisplay = false;
  } else if (currentInput === "0") {
    currentInput = num;
  } else {
    currentInput += num;
  }
  updateDisplay();
}

function inputDecimal() {
  if (shouldResetDisplay) {
    currentInput = "0.";
    shouldResetDisplay = false;
    updateDisplay();
    return;
  }
  if (!currentInput.includes(".")) {
    currentInput += ".";
    updateDisplay();
  }
}

function inputOperator(nextOperator) {
  const inputValue = parseFloat(currentInput);

  if (operator && !shouldResetDisplay) {
    const result = calculate(firstOperand, inputValue, operator);
    currentInput = formatResult(result);
    firstOperand = result;
  } else {
    firstOperand = inputValue;
  }

  operator = nextOperator;
  shouldResetDisplay = true;
  updateDisplay();
}

function calculate(a, b, op) {
  switch (op) {
    case "+":
      return a + b;
    case "-":
      return a - b;
    case "*":
      return a * b;
    case "/":
      return b === 0 ? NaN : a / b;
    default:
      return b;
  }
}

function formatResult(value) {
  if (Number.isNaN(value)) return "Error";
  // Round to avoid floating point noise, then trim trailing zeros
  return String(parseFloat(value.toPrecision(12)));
}

function handleEquals() {
  if (operator === null || shouldResetDisplay) return;

  const result = calculate(firstOperand, parseFloat(currentInput), operator);
  currentInput = formatResult(result);
  firstOperand = null;
  operator = null;
  shouldResetDisplay = true;
  updateDisplay();
}

function clearAll() {
  currentInput = "0";
  firstOperand = null;
  operator = null;
  shouldResetDisplay = false;
  updateDisplay();
}

function backspace() {
  if (shouldResetDisplay) return;
  currentInput = currentInput.length > 1 ? currentInput.slice(0, -1) : "0";
  if (currentInput === "-") currentInput = "0";
  updateDisplay();
}

function inputPercent() {
  const value = parseFloat(currentInput) / 100;
  currentInput = formatResult(value);
  updateDisplay();
}

buttons.forEach((button) => {
  button.addEventListener("click", () => {
    if (button.dataset.number !== undefined) {
      inputNumber(button.dataset.number);
    } else if (button.dataset.operator !== undefined) {
      inputOperator(button.dataset.operator);
    } else {
      switch (button.dataset.action) {
        case "clear":
          clearAll();
          break;
        case "backspace":
          backspace();
          break;
        case "decimal":
          inputDecimal();
          break;
        case "percent":
          inputPercent();
          break;
        case "equals":
          handleEquals();
          break;
      }
    }
  });
});

// Keyboard support
document.addEventListener("keydown", (event) => {
  const key = event.key;

  if (/^[0-9]$/.test(key)) {
    inputNumber(key);
  } else if (["+", "-", "*", "/"].includes(key)) {
    inputOperator(key);
  } else if (key === "." || key === ",") {
    inputDecimal();
  } else if (key === "Enter" || key === "=") {
    handleEquals();
  } else if (key === "Backspace") {
    backspace();
  } else if (key === "Escape" || key.toLowerCase() === "c") {
    clearAll();
  } else if (key === "%") {
    inputPercent();
  }
});

updateDisplay();
