"use strict";

var split = require("../split");
var svg = require("../svg");

module.exports = process;

function process (rgba_data, w, h) {
  return svg(split(rgba_data, w, h));
}
