# SharpVG

Sharp Vector Graphics

A library and command line utility to convert bitmaps to SVGs.

Why?

- SVG is currently the only reliable way to scale up pixelated graphics with preserving sharpness of the pixels that works across browsers.
- Converting to SVG might be useful in other scenarios, for example when we want to manipulate the image in real time.

Examples (from http://brainshave.com)

<svg width="16" height="15" xmlns="http://www.w3.org/2000/svg" version="1.1"><path d="M3,1h1v1h1v1h6v-1h1v-1h1v3h1v1h1v7h-1v1h-1v1h-10v-1h-1v-1h-1v-7h1v-1h1v-2M4,6v1h-1v5h1v1h2v-1h4v1h2v-1h1v-5h-1v-1h-3v1h-2v-1h-2M4,8h1v3h-1v-2M11,8h1v3h-1v-2M7,10h2v1h-2z" fill="black"></path></svg>

<svg width="16" height="15" xmlns="http://www.w3.org/2000/svg" version="1.1"><path d="M9,1h3v1h1v1h2v1h-1v1h-1v3h-1v3h-1v1h-1v1h-2v1h-5v-1h-1v-1h-1v-1h3v-1h-1v-2h-1v-2h-1v-4h4v1h1v1h1v1h1v-3h1M10,2h-1v5h-1v-1h-1v-1h-1v-1h-1v-1h-3v2h2v1h-1v1h2v1h-1v1h3v1h-2v1h-1v1h-1v1h5v-1h2v-1h1v-3h1v-3h1v-1h-1v-2h-1M10,3h1v2h-1v-1z" fill="black"></path></svg>

Features!

- converts bitmaps to SVGs
- currently supports only one-colour GIFs as input (originally created for my own use)
- fancy edge-tracing algorithm to maximally optimise output size

Usage (CLI):

    sharpvg file.gif > file.svg

Usage (node, simple):

    var sharpvg = require("sharpvg")
    var svg = sharpvg(fs.readFileSync("file.gif"))

Usage (node, step by step):

    var sharpvg = require("sharpvg")
    // raw file buffer:
    var data = fs.readFileSync("file.gif")
    // 2-dim array of 1s and 0s:
    var bitmap = sharpvg.gif(data)
    // producing svg is a separate step so we can take the bitmap from
    // different source
    var svg = sharpvg.svg(bitmap)

SharpVG also an experiment in me writing functional code so it uses
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