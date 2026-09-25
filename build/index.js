import * as FileSystem from "node:fs/promises";
import * as Path from "node:path";

import * as TBrush from "../lib/tbrush/index.ts.mjs";

import * as Xmldom from "@xmldom/xmldom";
import * as Yaml from "yaml";

const DOMAIN = "chiptumor.github.io";
const REPO = "chiptumor/chiptumor.github.io";
const BRANCH = "v0.3.0";

const domParser = new Xmldom.DOMParser();
const xmlSerializer = new Xmldom.XMLSerializer();

/** Intended for banner and status, which share a similar process. */
async function getDomAndDate(dirPath) {
  const files = await FileSystem.readdir(dirPath, {
    recursive: true
  });
  const filePath = files
    .filter(i => i.endsWith(".xml"))
    .reduce((max, name) => name > max ? name : max);
    
  const path = Path.join(dirPath, filePath);
  
  const file = await FileSystem.readFile(path, { encoding: "utf-8" });
  const dom = domParser.parseFromString(file, "text/xml");
  
  const dateValue = await fetch(
    `https://api.github.com/repos/${REPO}/commits`
    + `?sha=${BRANCH}&path=${ path.replaceAll("\\", "/") }&per_page=1`
  )
    .then(r => r.json())
    .then(j => j[0].commit.author.date);
  
  return { dom, dateValue };
}

/** Intended for banner and status, which share a similar process. */
function getInnerXml(dom, tagName) {
  return Array.from(
    dom.getElementsByTagName(tagName)[0].childNodes
  ).join("");
}

const template = {
  greeting: "Haio!!",
  
  banner: (async () => {
    const { dom, dateValue } = await getDomAndDate("content/banner/");

    return {
      summary: getInnerXml(dom, "summary"),
      body: getInnerXml(dom, "body"),
      dateValue: dateValue
    };
  })(),
  status: (async () => {
    const { dom, dateValue } = await getDomAndDate("content/status/");
    
    return {
      feeling: dom.documentElement.getAttribute("feeling"),
      body: getInnerXml(dom, "body"),
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
  todo: (async () => {
    return "todo";
  })()
};

