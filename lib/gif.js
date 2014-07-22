"use strict";

module.exports = pixels;

var GifReader = require("omggif").GifReader;
var I = require("ancient-oak");

function pixels (file_content) {
  var img = new GifReader(file_content);

  var w = img.width, h = img.height;

  var data = new Uint8Array(w * h * 4);
  img.decodeAndBlitFrameRGBA(0, data);

  var pixmap = new Array(h);

  for (var y = 0; y < h; ++y) {
    pixmap[y] = new Array(w);
    for (var x = 0; x < w; ++x) {
      pixmap[y][x] = (data[(y * w + x) * 4 + 3] > 0) ? 1 : 0;
    }
  }

  return I(pixmap);
}
