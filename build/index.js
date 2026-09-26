import * as FileSystem from "node:fs/promises";
import * as Path from "node:path";

import * as TBrush from "../lib/tbrush/index.ts.mjs";

import * as Marked from "marked";
import * as Xmldom from "@xmldom/xmldom";
import * as Yaml from "yaml";

const DOMAIN = "chiptumor.github.io";
const REPO = "chiptumor/chiptumor.github.io";
const BRANCH = "v0.3.0";

const workDir = Path.join(import.meta.dirname, "..");

const domParser = new Xmldom.DOMParser();

/**
 * Intended for banner and status, which share a similar process.
 * @param {string} dir
 */
async function getDomAndDate(dir) {
  const files = await FileSystem.readdir(
    Path.join(workDir, dir),
    { recursive: true }
  );
  const filePath = files
    .filter(i => i.endsWith(".xml"))
    .reduce((max, name) => name > max ? name : max);
    
  const path = Path.join(dir, filePath);
  
  const file = await FileSystem.readFile(
    Path.join(workDir, path),
    { encoding: "utf-8" }
  );
  const dom = domParser.parseFromString(file, "text/xml");
  
  /** @type {string} */
  const dateValue = await fetch(
    `https://api.github.com/repos/${REPO}/commits`
    + `?sha=${BRANCH}&path=${ path.replaceAll("\\", "/") }&per_page=1`
  )
    .then(r => r.json())
    .then(j => j[0].commit.author.date);
  
  return { dom, dateValue };
}

const template = (async () => ({
  greeting: "Haio!!",
  
  banner: await (async () => {
    const { dom, dateValue } = await getDomAndDate("content/banner/");

    const fromTagName = (tagName) =>
      dom.getElementsByTagName(tagName)[0].childNodes.toString();

    return {
      summary: fromTagName("summary"),
      body: fromTagName("body"),
      dateValue: dateValue
    };
  })(),
  status: await (async () => {
    const { dom, dateValue } = await getDomAndDate("content/status/");
    const doc = dom.documentElement;
    
    return {
      feeling: doc.getAttribute("feeling"),
      body: doc.childNodes.toString(),
      dateValue: dateValue
    };
  })(),
  
  latestBlog: {
    url: `https://${DOMAIN}/fun/poopbuttsuck`,
    preview: "<p>No blogs yet. Here's a link to PoopButtSuck for now.</p>"
  },
  webrings: [ { class: "string", content: "string" } ],
  blinkies: [ { href: "string or undefined", img: "string" } ],
  usefulPages: [ { title: "string", href: "string" } ],
  todo: await (async () => {
    const filePath = "TODO.md";

    const file = await FileSystem.readFile(
      Path.join(workDir, filePath),
      { encoding: "utf-8" }
    );
    const parsed = Marked.parse(file, {
      async: true,
      gfm: true
    });
      
    return parsed;
  })()
}))();

template.then(console.dir);

