"use strict";

module.exports = pixels;

var GifReader = require("omggif").GifReader;
var split = require("./split");

function pixels (file_content) {
  var img = new GifReader(file_content);

  var w = img.width, h = img.height;

  var data = new Uint8Array(w * h * 4);
  img.decodeAndBlitFrameRGBA(0, data);

  return split(data, w, h);
}
