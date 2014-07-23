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
    var start = starting_point(orientmap,
                               state("coverage"),
                               points(w, h, state("start")));
    return (start
            ? (trace_one(start, orientmap, state("coverage"))
               .set("start", start))
            : null);
  }, {
    start: { x: 0, y: 0 },
    coverage: arr2d(h)
  }).all().slice(1).map(function (state) {
    return state("moves");
  });

  return flatten(paths);
}


function trace_one (start, orientmap, coverage) {
  var result = lazy(function (state) {
    var move = orientmap(state("y"))(state("x"));

    // special case where we have to turn left from current
    // direction.
    if (move("next")) {
      var moves = state("moves");
      move = next_move_ccw(moves(moves.size - 1));
    }

    var x = state("x") + (move("h") || 0);
    var y = state("y") + (move("v") || 0);

    return (x === start("x") && y === start("y")
            ? null
            : (state
               .update("coverage", function (coverage) {
                 return deepset(coverage, y, x, true);
               })
               .update("moves", function (moves) {
                 return moves.push(move);
               })
               .set("x", x)
               .set("y", y)));
  }, {
    x: start("x"),
    y: start("y"),
    moves: [{ x: start("x"), y: start("y") }],
    coverage: deepset(coverage, start("y"), start("x"), true)
  });

  return result.last();
}

function deepset (object, key) {
  var extra_path = Array.prototype.slice.call(arguments, 2, -1);
  var value = arguments[arguments.length - 1];

  return (extra_path.length === 0
          ? object.set(key, value)
          : object.update(key, function (field) {
            return deepset.apply(null, [field].concat(extra_path).concat([value]));
          }));
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
    last:  last,
    all:   all
  });

  return list;

  function next () {
    return lazy(generator, generator(value));
  }

  function find (condition) {
    return lazy_find(list, condition);
  }

  function last (condition) {
    return lazy_last(list);
  }

  function all () {
    return lazy_all(list);
  }
}

function lazy_last (list) {
  var next = list;

  while (next.value !== null) {
    list = next;
    next = next.next();
  }

  return list.value;
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

function next_move_ccw (move) {
  return I(move("v") === -1
           ? { h: -1 }
           : move("h") === -1
           ? { v: 1 }
           : move("v") === 1
           ? { h: 1 }
           : { v: -1 });
}
