# SharpVG

Sharp Vector Graphics

A library and command line utility to convert bitmaps to SVGs.

Why?

- SVG is currently the only static cross-browser way to scale up pixelated graphics with preserving sharpness of the pixels that [works across browsers][royko].
- Converting to SVG might be useful in other scenarios, for example when we want to manipulate the image in real time.

[royko]: http://vaughnroyko.com/state-of-nearest-neighbor-interpolation-in-canvas/

Features!

- converts gifs to SVGs
- colour! (one path for each colour)
- fancy edge-tracing algorithm to maximally optimise output size

Examples!

Check out the icons at http://brainshave.com :-) . They're included in
this repo and you can generate them by running `npm test`. (Included
only for testing purposes, so please don't use them anywhere.)

Usage (CLI):

    sharpvg file.gif > file.svg

Usage (node, simple):

    var sharpvg = require("sharpvg")
    var svg = sharpvg(fs.readFileSync("file.gif"))

Usage (node, step by step):

    var gif = require("sharpvg/gif")
    var svg = require("sharpvg/svg")

    // raw file buffer:
    var raw = fs.readFileSync("file.gif")

    // 2-dim array of 1s and 0s:
    var bitmap = gif(raw)

    // producing svg is a separate step so we can take the bitmap from
    // different source
    var image = svg(bitmap)

Planned features:

- PNG input
- animated gif support

LICENSE: Source code: MIT, see [COPYING](COPYING), icons (gif files in
spec directory): only for testing purposes.