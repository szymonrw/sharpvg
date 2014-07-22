#!/usr/bin/env node

"use strict";

var fs = require("fs");
var gif = require("./gif");
var svg = require("./index");

if (process.argv.length < 3) {
  console.log("Usage: sharpvg <file.gif>");
  process.exit(1);
}

var data = fs.readFileSync(process.argv[2]);

console.log(svg(gif(data)));
