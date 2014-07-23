# SharpVG

Sharp Vector Graphics

A library and command line utility to convert bitmaps to SVGs.

Why?

- SVG is currently the only reliable way to scale up pixelated graphics with preserving sharpness of the pixels that works across browsers.
- Converting to SVG might be useful in other scenarios, for example when we want to manipulate the image in real time.

Examples (from http://brainshave.com)

<img src="data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%2216%22%20height%3D%2215%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20version%3D%221.1%22%3E%3Cpath%20d%3D%22M3%2C1h1v1h1v1h6v-1h1v-1h1v3h1v1h1v7h-1v1h-1v1h-10v-1h-1v-1h-1v-7h1v-1h1v-2zM4%2C6v1h-1v5h1v1h2v-1h4v1h2v-1h1v-5h-1v-1h-3v1h-2v-1h-2zM4%2C8h1v3h-1v-2zM11%2C8h1v3h-1v-2zM7%2C10h2v1h-2z%22%20fill%3D%22black%22%3E%3C%2Fpath%3E%3C%2Fsvg%3E">

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