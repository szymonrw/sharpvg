"use strict";

module.exports = trace;

var I = require("ancient-oak");

function trace (orientmap, w, h) {
  var coverage = new Array(h);
  for (var i = 0; i < h; ++i) {
    coverage[i] = new Array(w);
  }

  var paths = [];

  do {
    var p = trace_one(orientmap, coverage, w, h);
    if (p) paths.push(p);
  } while (p);

  return paths.reduce(function (agg, p) {
    return p.reduce(function (agg, el) {
      return agg.push(el);
    }, agg);
  }, I([]));
}

function trace_one (orientmap, coverage, w, h) {
  // find starting point that hasn't been covered yet.
  outer_loop:
  for (var y = 0; y < h; ++y) {
    for (var x = 0; x < w; ++x) {
      if (orientmap(y)(x) && !coverage[y][x]) break outer_loop;
    }
  }

  if (x === w && y === h) return null;

  var start_x = x;
  var start_y = y;

  var moves = I([{ x: x, y: y }]);

  do {
    coverage[y][x] = true;
    var move = orientmap(y)(x);

    // special case where we have to move leftwise from current
    // direction.
    if (move("next")) {
      move = next_move_ccw(moves(moves.size - 1));
    }

    x += move("h") || 0;
    y += move("v") || 0;

    if (x === start_x && y === start_y) break;

    moves = moves.push(move);
  } while (true);

  return moves;
}

function next_move_ccw (move, dir) {
  return I(move("v") === -1
           ? { h: -1 }
           : move("h") === -1
           ? { v: 1 }
           : move("v") === 1
           ? { h: 1 }
           : { v: -1 });
}
