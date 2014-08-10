"use strict";

module.exports = split;

// Split colors of RGBA data to separate 2d arrays.

function split (data, w, h) {
  var colors = {};

  var pixmap = new Array(h);
  var pos = 0;

  for (var y = 0; y < h; ++y) {
    pixmap[y] = new Array(w);
    for (var x = 0; x < w; ++x) {
      pos = (y * w + x) * 4;
      if (data[pos + 3] > 0) {
        set(x, y, data[pos], data[pos + 1], data[pos + 2]);
      }
    }
  }

  return {
    w: w,
    h: h,
    colors: colors
  };

  function set (x, y, r, g, b) {
    var hex = "#" + [r, g, b].map(hexaze).join("");

    if (!colors[hex]) {
      colors[hex] = new Array(h);

      for (var i = 0; i < h; ++i) {
        colors[hex][i] = new Uint8Array(w);
      }
    }

    colors[hex][y][x] = 1;
  }
}

function hexaze (num) {
  var str = num.toString(16);
  return str.length === 1 ? "0" + str : str;
}
