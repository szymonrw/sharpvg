"use strict";

module.exports = optimize;

var I = require("ancient-oak");

function optimize (moves) {
  var result = moves.reduce(function (agg, move) {
    var compressed = compress_moves(agg("end"), move);

    return (agg
            // Add the previous "end" if compressed has two elements
            .set("list", concat(agg("list"), compressed.pop()))
            // The current "end" is the last of the compressed elements
            .set("end",  compressed(compressed.size - 1)));
  }, I({ list: [], end: null }));

  // add the last element
  return result("list").push(result("end"));
}

function concat (a, b) {
  return b.reduce(function (agg, el) {
    return a.push(el);
  }, a);
}

function compress_moves (a, b) {
  return I(a === null   ? [b]
           : b === null ? [a]
           // compress moves in the same direction
           : same_sig(a("h"), b("h")) ? [{ h: a("h") + b("h") }]
           : same_sig(a("v"), b("v")) ? [{ v: a("v") + b("v") }]
           // return both moves if they've nothing in common
           : [a, b]);
}

function same_sig (a, b) {
  return a * b > 0;
}
