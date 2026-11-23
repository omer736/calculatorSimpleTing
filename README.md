# PIXEL CALC

A tiny retro 8-bit calculator. No build step, no dependencies — open `index.html`
and start mashing keys.

![style: 8-bit](https://img.shields.io/badge/style-8--bit-4cf08a)

## Running it

```bash
open index.html
```

Or serve it if you prefer a real origin:

```bash
python3 -m http.server 8000
```

Then visit <http://localhost:8000>.

## Controls

| Key                  | Action              |
| -------------------- | ------------------- |
| `0`–`9`              | Digits              |
| `+` `-` `*` `/`      | Operators           |
| `Enter` / `=`        | Evaluate            |
| `.` / `,`            | Decimal point       |
| `%`                  | Percent             |
| `Backspace`          | Delete last digit   |
| `Esc` / `C`          | Clear everything    |

## Layout

```
index.html           markup for the cabinet, screen and keypad
src/styles.css       pixel borders, CRT scanlines, chunky keys
src/calculator.js    pure state machine — no DOM, unit testable
src/app.js           wires the state machine to clicks and keystrokes
tests/calculator.test.js   node:test suite for the state machine
```

## Tests

```bash
node --test tests/
```

Requires Node 18+ (uses the built-in `node:test` runner — no packages to install).

## Accessibility

Every key carries an `aria-label`, the keypad is a labelled `role="group"`, and the
display is an `aria-live` region, so a screen reader announces each result. Key
presses respect `prefers-reduced-motion`.
