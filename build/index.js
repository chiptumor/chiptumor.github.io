import * as FileSystem from "node:fs/promises";
import * as Dir from "./util/dir.js";

await FileSystem.rm(Dir.dist(), {
  recursive: true,
  force: true
})
  .then(() => FileSystem.mkdir(Dir.dist()));

await FileSystem.cp(Dir.root("static"), Dir.dist(), {
  recursive: true
});

import "./page/index.js";

