"use strict";

module.exports = orients;

var I = require("ancient-oak");

var ORIENTS = I({
  "1000": { h: -1 },
  "0100": { v: -1 },
  "0010": { v:  1 },
  "0001": { h:  1 },
  "0111": { v: -1 },
  "1011": { h:  1 },
  "1101": { h: -1 },
  "1110": { v:  1 },
  "0011": { h:  1 },
  "1100": { h: -1 },
  "1010": { v:  1 },
  "0101": { v: -1 },
  "1001": { next: true },
  "0110": { next: true }
});


function orients (pixels) {
  return pixels.map(function (row, y) {
    return row.map(function (_, x) {
      return ORIENTS(code(pixels, x, y));
    });
  });
}

function code (pixels, x, y) {
  return [value(x - 1, y - 1),
          value(x    , y - 1),
          value(x - 1, y    ),
          value(x    , y    )].join("");

  function value (x, y) {
    return (pixels(y) || I([]))(x) || 0;
  }
}
