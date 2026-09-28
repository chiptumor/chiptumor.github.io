import * as Path from "node:path";

import * as Tbrush from "../../../lib/tbrush/index.ts.mjs";

import * as Dir from "../../util/dir.js";

const DIR = "res/glyph";
const COLORS = [
  "white",
  "black"
];

const src = Path.join("src", DIR);
const files = await Dir.readDir(src);

for (const file of files) {
  const content = await Dir.readFile(src, file);
  const tbrush = Tbrush.compose(content);

  for (const color of COLORS) {
    const final = tbrush.apply({ color });
    const path = Path.join(DIR, file.replace(/(\..+?)$/, `-${color}$1`));
    Dir.writeFile(path, final);
  }
}
