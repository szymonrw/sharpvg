!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.sharpvg=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

module.exports = optimize;

function optimize (moves) {
  var len = moves.length;
  var out = [];
  var current;

  for (var i = 1, prev = moves[0]; i < len; ++i) {
    var current = moves[i];

    if (same_sig(prev.h, current.h)) {
      current = { h: prev.h + current.h };
    } else if (same_sig(prev.v, current.v)) {
      current = { v: prev.v + current.v };
    } else {
      out.push(prev);
    }

    prev = current;
  }

  return out;
}

function same_sig (a, b) {
  return a * b > 0;
}

},{}],2:[function(require,module,exports){
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

},{}],3:[function(require,module,exports){
"use strict";

module.exports = trace;

function arr2d (h) {
  var arr = [];
  for (var i = 0; i < h; ++i) {
    arr[i] = [];
  }

  return arr;
}

function trace (orients) {
  var h = orients.length;
  var w = orients[0].length;

  var coverage = arr2d(h);

  var paths = [];

  // find starting point that hasn't been covered yet.
  for (var y = 0; y < h; ++y) {
    for (var x = 0; x < w; ++x) {
      if (orients[y][x] && !coverage[y][x]) {
        paths.push(trace_one(x, y, orients, coverage));
      }
    }
  }

  return flatten(paths);
}

function trace_one (x, y, orients, coverage) {
  var start_x = x;
  var start_y = y;

  var moves = [{ x: x, y: y }];

  do {
    var move = orients[y][x];

    // special case where we have to move leftwise from current
    // direction.
    if (move.next) {
      move = next_move_ccw(moves[moves.length - 1]);
    }

    moves.push(move);

    x += move.h || 0;
    y += move.v || 0;

    coverage[y][x] = true;
  } while (x !== start_x || y !== start_y);

  return moves;
}


function next_move_ccw (move) {
  return (move.v === -1
          ? { h: -1 }
          : move.h === -1
          ? { v: 1 }
          : move.v === 1
          ? { h: 1 }
          : { v: -1 });
}

function flatten (paths) {
  return paths.reduce(function (agg, p) {
    p.forEach(function (el) {
      agg.push(el);
    });
    return agg;
  }, []);
}

},{}],4:[function(require,module,exports){
"use strict";

var split = require("../split");
var svg = require("../svg");

module.exports = process;

function process (rgba_data, w, h) {
  return svg(split(rgba_data, w, h));
}

},{"../split":5,"../svg":6}],5:[function(require,module,exports){
"use strict";

module.exports = split;

// Split colors of RGBA data to separate 2d arrays.

function split (data, w, h) {
  var colors = {};

  var pos = 0;

  for (var y = 0; y < h; ++y) {
    for (var x = 0; x < w; ++x) {
      pos = (y * w + x) * 4;
      if (data[pos + 3] > 0) {
        set(x, y, data[pos], data[pos + 1], data[pos + 2]);
      }
    }
  }

  return {
    w: w,
    h: h,
    colors: colors
  };

  function set (x, y, r, g, b) {
    var hex = "#" + [r, g, b].map(hexaze).join("");

    if (!colors[hex]) {
      colors[hex] = new Array(h);

      for (var i = 0; i < h; ++i) {
        colors[hex][i] = new Uint8Array(w);
      }
    }

    colors[hex][y][x] = 1;
  }
}

function hexaze (num) {
  var str = num.toString(16);
  return str.length === 1 ? "0" + str : str;
}

},{}],6:[function(require,module,exports){
"use strict";

module.exports = svg;

var orient = require("./lib/orient");
var trace = require("./lib/trace");
var optimize = require("./lib/optimize");

function svg (image) {
  var h = image.w + 2;
  var w = image.h + 2;

  return ["<svg ",
          "width=\"", image.w, "\" ",
          "height=\"", image.h, "\" ",
          "xmlns=\"http://www.w3.org/2000/svg\">",
         ].concat(paths(image.colors).map(function (p) {
           return "<path d=\"" + p.d + "\" fill=\"" + p.fill + "\"/>";
         })).concat(["</svg>"]).join("");
}

function paths (colors) {
  var out = [];

  for (var color in colors) {
    var img = colors[color];
    out.push({
      fill: color,
      d: path(optimize(trace(orient(img))))
    });
  }

  return out;
}

function path (moves) {
  return moves.map(function (move) {
    return (move.h
            ? "h" + move.h
            : move.v
            ? "v" + move.v
            // accomodate for 1px margin we've introduced earlier
            : "M" + (move.x - 1) + "," + (move.y - 1));
  }).join("") + "z";
}

},{"./lib/optimize":1,"./lib/orient":2,"./lib/trace":3}]},{},[4])(4)
});