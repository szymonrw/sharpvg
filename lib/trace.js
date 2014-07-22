"use strict";

module.exports = trace;

var I = require("ancient-oak");

function arr2d (h) {
  var arr = I([]);
  for (var i = 0; i < h; ++i) {
    arr = arr.set(i, []);
  }

  return arr;
}

function trace (orientmap, w, h) {
  var coverage = arr2d(h);
  var paths = I([]);

  do {
    var start = starting_point(orientmap, coverage, w, h);
    if (!start) break;

    var r = trace_one(start, orientmap, coverage);

    paths = paths.push(r("moves"));
    coverage = r("coverage");
  } while (true);

  // flatten
  return paths.reduce(function (agg, p) {
    return p.reduce(function (agg, el) {
      return agg.push(el);
    }, agg);
  }, I([]));
}

function starting_point (orientmap, coverage, w, h) {
  // find starting point that hasn't been covered yet.
  outer_loop:
  for (var y = 0; y < h; ++y) {
    for (var x = 0; x < w; ++x) {
      if (orientmap(y)(x) && !coverage(y)(x)) break outer_loop;
    }
  }

  return (x !== w || y !== h
          ? I({x: x, y: y})
          : null);
}

function trace_one (start, orientmap, coverage) {
  var x = start("x");
  var y = start("y");

  var start_x = x;
  var start_y = y;

  var moves = I([{ x: x, y: y }]);

  do {
    coverage = coverage.update(y, function (row) {
      return row.set(x, true);
    });

    var move = orientmap(y)(x);

    // special case where we have to turn left from current
    // direction.
    if (move("next")) {
      move = next_move_ccw(moves(moves.size - 1));
    }

    x += move("h") || 0;
    y += move("v") || 0;

    if (x === start_x && y === start_y) break;

    moves = moves.push(move);
  } while (true);

  return I({
    moves:    moves,
    coverage: coverage
  })
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
