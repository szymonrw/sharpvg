#!/usr/bin/env node

"use strict";

var fs = require("fs");
var convert = require("./index");

if (process.argv.length < 3) {
  console.log("Usage: sharpvg <file.gif>");
  process.exit(1);
}

var data = fs.readFileSync(process.argv[2]);

process.stdout.write(convert(data));
