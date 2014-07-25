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
