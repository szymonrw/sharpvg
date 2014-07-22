"use strict";

module.exports = optimize;

var I = require("ancient-oak");

function optimize (moves) {
  return moves.push({}).reduce(function (agg, move) {
    var compressed = compress_moves(agg("current"), move);

    return (agg
            .set("list", concat(agg("list"), compressed.pop()))
            .set("current", compressed(compressed.size - 1)));
  }, I({ list: [], current: null }))("list");
}

function concat (a, b) {
  return b.reduce(function (agg, el) {
    return a.push(el);
  }, a);
}

function compress_moves (a, b) {
  return I(a === null
           ? [b]
           : b === null
           ? [a]
           : same_sig(a("h"), b("h"))
           ? [{ h: a("h") + b("h") }]
           : same_sig(a("v"), b("v"))
           ? [{ v: a("v") + b("v") }]
           : [a, b]);
}

function same_sig (a, b) {
  return a * b > 0;
}
