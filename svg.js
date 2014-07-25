"use strict";

module.exports = svg;

var xml = require("xml");

var orient = require("./lib/orient");
var trace = require("./lib/trace");
var optimize = require("./lib/optimize");

function svg (image) {
  var h = image.w + 2;
  var w = image.h + 2;

  return xml({
    svg: [{
      _attr: {
        viewBox: [ 1, 1, w - 1, h - 1].join(" "),
        xmlns: "http://www.w3.org/2000/svg",
        version: "1.1"
      }
    }].concat(paths(image.colors).map(function (p) {
      return { path: [{ _attr: p }] };
    }))
  });
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
            : "M" + move.x + "," + move.y);
  }).reduce(function (str, move) {
    return str + move;
  }, "")+ "z";
}
