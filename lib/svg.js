"use strict";

module.exports = svg;

var xml = require("xml");

var ORIENTATIONS = {
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
}

function svg (pixmap) {
  var h = pixmap.length;
  var w = pixmap[0].length;

  var orients = orientations(pixmap);

  var coverage = new Array(h);
  for (var i = 0; i < h; ++i) {
    coverage[i] = new Array(w);
  }

  var paths = [];

  do {
    var path = trace(orients, coverage, w, h);
    if (path) paths.push(path);
  } while (path);

  return xml({
    svg: [{
      _attr: {
        width: w,
        height: h,
        xmlns: "http://www.w3.org/2000/svg",
        version: "1.1"
      }
    },{
      path: [{
        _attr: {
          d: paths.join(""),
          fill: "black"
        }
      }]
    }]
  });
}

function trace (orients, coverage, w, h) {
  // find starting point that hasn't been covered yet.
  outer_loop:
  for (var y = 0; y < h; ++y) {
    for (var x = 0; x < w; ++x) {
      if (orients[y][x] && !coverage[y][x]) break outer_loop;
    }
  }

  if (x === w && y === h) return null;

  var start_x = x;
  var start_y = y;

  var moves = [{ x: x, y: y }];

  do {
    coverage[y][x] = true;
    var move = orients[y][x];

    // special case where we have to move leftwise from current
    // direction.
    if (move.next) {
      move = next_move_ccw(moves[moves.length - 1]);
    }

    moves.push(move);

    x += move.h || 0;
    y += move.v || 0;

  } while (x !== start_x || y !== start_y);

  return path(optimize(moves.slice(0, -1)));
}

function next_move_ccw (move, dir) {
  return (move.v === -1
          ? { h: -1 }
          : move.h === -1
          ? { v: 1 }
          : move.v === 1
          ? { h: 1 }
          : { v: -1 });
}

function optimize (moves) {
  return moves.reduce(function (agg, move) {
    move = clone(move);
    var last = agg[agg.length - 1];
    if (!last) {
      agg.push(move);
    } else if (last.v > 0 && move.v === 1) {
      ++last.v;
    } else if (last.v < 0 && move.v === -1) {
      --last.v;
    } else if (last.h > 0 && move.h === 1) {
      ++last.h;
    } else if (last.h < 0 && move.h === -1) {
      --last.h;
    } else {
      agg.push(move);
    }

    return agg;
  }, []);
}

function path (moves) {
  return moves.map(function (move) {
    return ("h" in move
            ? "h" + move.h
            : "v" in move
            ? "v" + move.v
            : "M" + move.x + "," + move.y);
  }).join("") + "z";
}

function clone (object) {
  var copy = {};
  for (var name in object) {
    copy[name] = object[name];
  }
  return copy;
}

function orientations (pixels) {
  return pixels.map(function (row, y) {
    return row.map(function (_, x) {
      var code = orientation_code(pixels, x, y);
      return (ORIENTATIONS[code]);
    });
  });
}

function orientation_code (pixels, x, y) {
  return [((pixels[y-1] || [])[x-1] || 0),
          ((pixels[y-1] || [])[x] || 0),
          ((pixels[y] || [])[x-1] || 0),
          ((pixels[y] || [])[x] || 0)].join("");
}
