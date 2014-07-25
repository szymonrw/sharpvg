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
