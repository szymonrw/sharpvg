# SharpVG

Sharp Vector Graphics

A library and command line utility to convert bitmaps to SVGs.

Why?

- SVG is currently the only reliable way to scale up pixelated graphics with preserving sharpness of the pixels that works across browsers.
- Converting to SVG might be useful in other scenarios, for example when we want to manipulate the image in real time.

Features!

- converts bitmaps to SVGs
- currently supports only one-colour GIFs as input (originally created for my own use)
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

SharpVG also an experiment in writing functional code so it uses
[Ancient Oak][oak] and all in and out data is immutable (apart from
file buffers). To get a mutable version, you can use the `.dump()`
method.

[oak]: https://github.com/brainshave/ancient-oak

Planned features:

- colour support (both indexed and 24-bit)
- PNG input
- animated gif support

LICENSE: Source code: MIT, see [COPYING](COPYING), icons (gif files in
spec directory): only for testing purposes.