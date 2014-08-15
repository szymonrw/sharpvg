"use strict";

module.exports = svg;

var orient = require("./lib/orient");
var trace = require("./lib/trace");
var optimize = require("./lib/optimize");

function svg (image) {
  var h = image.w + 2;
  var w = image.h + 2;

  return ["<svg ",
          "width=\"", image.w, "\" ",
          "height=\"", image.h, "\" ",
          "xmlns=\"http://www.w3.org/2000/svg\">",
         ].concat(paths(image.colors).map(function (p) {
           return "<path d=\"" + p.d + "\" fill=\"" + p.fill + "\"/>";
         })).concat(["</svg>"]).join("");
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
            // accomodate for 1px margin we've introduced earlier
            : "M" + (move.x - 1) + " " + (move.y - 1));
  }).join("") + "z";
}
