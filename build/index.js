import * as FileSystem from "node:fs/promises";
import * as Path from "node:path";

import * as TBrush from "../lib/tbrush/index.ts.mjs";

import * as Xmldom from "@xmldom/xmldom";
import * as Yaml from "yaml";

const REPO = "chiptumor/chiptumor.github.io";
const BRANCH = "v0.3.0";

const domParser = new Xmldom.DOMParser();
const xmlSerializer = new Xmldom.XMLSerializer();

const template = {
  greeting: "Haio!!",
  banner: (async () => {
    const dirPath = "content/banner/";

    const files = await FileSystem.readdir(dirPath, {
      recursive: true
    });
    const filePath = files
      .filter(i => i.endsWith(".xml"))
      .reduce((max, name) => name > max ? name : max);

    const path = Path.join(dirPath, filePath);
    console.debug(path);
    const file = await FileSystem.readFile(path, { encoding: "utf-8" });
    const dom = domParser.parseFromString(file, "text/xml");
    
    const summary = Array.from(
      dom.getElementsByTagName("summary")[0].childNodes
    ).join("");
    const body = Array.from(
      dom.getElementsByTagName("body")[0].childNodes
    ).join("");

    const dateValue = (
      await fetch(
        `https://api.github.com/repos/${REPO}/commits`
        + `?sha=${BRANCH}&path=${ path.replaceAll("\\", "/") }&per_page=1`
      ).then(r => r.json())
    )[0].commit.author.date;

    return { summary, body, dateValue };
  })(),
  status: {
    feeling: "string",
    body: "string",
    absoluteDate: "string"
  },
  latestBlog: {
    url: "string",
    preview: "string"
  },
  webrings: [ { class: "string", content: "string" } ],
  blinkies: [ { href: "string or undefined", img: "string" } ],
  usefulPages: [ { title: "string", href: "string" } ],
  todo: "string"
};

