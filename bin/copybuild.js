const fs = require("fs");
const path = require("path");

const src = path.resolve(__dirname + "/../build/Release/addon.node");
const dest = path.resolve(__dirname + "/../dist/addon.node");

fs.copyFileSync(src, dest);