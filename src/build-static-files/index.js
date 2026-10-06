import * as FileSystem from "node:fs/promises";
import * as Dir from "./util/dir.js";

const dist = Dir.dist();

await FileSystem.rm(dist, {
  recursive: true,
  force: true
})
  .then(() => FileSystem.mkdir(dist));

await FileSystem.cp(Dir.root("src/build-static-files/static"), dist, {
  recursive: true
});

import("./build/index.js");;
