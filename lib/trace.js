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
  var paths = lazy(function (state) {
    var start = starting_point(orientmap, state("coverage"), points(w, h, state("start")));
    return (start
            ? trace_one(start, orientmap, state("coverage")).set("start", start)
            : null);
  }, {
    start: { x: 0, y: 0 },
    coverage: arr2d(h)
  }).all().slice(1).map(function (state) {
    return state("moves");
  });

  return flatten(paths);
}

function flatten(paths) {
  return paths.reduce(function (agg, p) {
    return p.reduce(function (agg, el) {
      return agg.push(el);
    }, agg);
  }, I([]));
}

function inc (v) {
  return v + 1;
}

function points (w, h, start) {
  return lazy(function (point) {
    return (point("x") < w - 1
            ? point.update("x", inc)
            : point("y") < h - 1
            ? point.update("y", inc).set("x", 0)
            : null);
  }, start || {
    x: 0, y: 0
  });
}

function lazy (generator, value) {
  value = I(value);

  var list = Object.freeze({
    value: value,
    next:  next,
    find:  find,
    all:   all
  });

  return list;

  function next () {
    return lazy(generator, generator(value));
  }

  function find (condition) {
    return lazy_find(list, condition);
  }

  function all () {
    return lazy_all(list);
  }
}

function lazy_all (list) {
  var result = I([]);
  while (list.value !== null) {
    result = result.push(list.value);
    list = list.next();
  }
  return result;
}

function lazy_find (list, condition) {
  var head = list.value;

  while (head !== null && condition(head)) {
    list = list.next();
    head = list.value;
  }

  return list;
}

function starting_point (orientmap, coverage, points) {
  // find starting point that hasn't been covered yet.
  return points.find(function (value) {
    var x = value("x");
    var y = value("y");
    return !orientmap(y)(x) || coverage(y)(x);
  }).value;
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

function next_move_ccw (move) {
  return I(move("v") === -1
           ? { h: -1 }
           : move("h") === -1
           ? { v: 1 }
           : move("v") === 1
           ? { h: 1 }
           : { v: -1 });
}
