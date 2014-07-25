"use strict";

module.exports = orients;

var MOVES = Object.freeze({
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
  // we add a margin
  var h = pixels.length + 2;
  var w = pixels[0].length + 2;

  var result = new Array(h);
  var row;

  for (var y = 0; y < h; ++y) {
    row = result[y] = new Array(w);
    for (var x = 0; x < w; ++x) {
      row[x] = MOVES[code(pixels, x - 1, y - 1)];
    }
  }

  return result;
}

var EMPTY_ARRAY = [];

function code (pixels, x, y) {
  return [value(x - 1, y - 1),
          value(x    , y - 1),
          value(x - 1, y    ),
          value(x    , y    )].join("");

  function value (x, y) {
    return (pixels[y] || EMPTY_ARRAY)[x] || 0;
  }
}
