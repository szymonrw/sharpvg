"use strict";

module.exports = svg;

var xml = require("xml");

var orient = require("./lib/orient");
var trace = require("./lib/trace");
var optimize = require("./lib/optimize");

function svg (pixmap) {
  var h = pixmap.length + 2;
  var w = pixmap[0].length + 2;

  var data = path(optimize(trace(orient(pixmap), w, h)));

  return xml({
    svg: [{
      _attr: {
        viewBox: [ 1, 1, w - 2, h - 2].join(" "),
        xmlns: "http://www.w3.org/2000/svg",
        version: "1.1"
      }
    },{
      path: [{
        _attr: {
          d: data,
          fill: "black"
        }
      }]
    }]
  });
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
