import * as FileSystem from "node:fs/promises";
import * as Path from "node:path";

import * as Tbrush from "../lib/tbrush/index.ts.mjs";

import * as Marked from "marked";
import * as Xmldom from "@xmldom/xmldom";
import * as Yaml from "yaml";

import CONFIG from "./config.js";
import * as Dir from "./util/dir.js";

const domParser = new Xmldom.DOMParser();

await FileSystem.rm(Dir.dist(), {
  recursive: true,
  force: true
})
  .then(() => FileSystem.mkdir(Dir.dist()));

await FileSystem.cp(Dir.root("static"), Dir.dist(), {
  recursive: true
});

/**
 * Intended for banner and status, which share a similar process.
 * @param {string} dir
 */
async function getDomAndDate(dir) {
  const files = await Dir.readDir(dir);
  const filePath = files
    .filter(i => i.endsWith(".xml"))
    .reduce((max, name) => name > max ? name : max);
    
  const path = Path.join(dir, filePath);
  
  const file = await Dir.readFile(path);
  const dom = domParser.parseFromString(file, "text/xml");

  const url = `https://api.github.com/repos/${CONFIG.repo}/commits`
    + `?sha=${CONFIG.branch}&path=${ path.replaceAll("\\", "/") }&per_page=1`;
  
  /** @type {string} */
  const datetime = await fetch(url)
    .then(r => r.json())
    .then(j => j[0].commit.author.date);
  
  return { dom, datetime };
}

const template = (async () => ({
  greeting: "Haio!!",
  
  banner: await (async () => {
    const path = "content/banner/";

    const { dom, datetime } = await getDomAndDate(path);

    const fromTagName = (tagName) =>
      dom.getElementsByTagName(tagName)[0].childNodes.toString();

    return {
      summary: fromTagName("summary"),
      body: fromTagName("body"),
      datetime: datetime
    };
  })(),
  status: await (async () => {
    const path = "content/status/";

    const { dom, datetime } = await getDomAndDate(path);
    const doc = dom.documentElement;
    
    return {
      feeling: doc.getAttribute("feeling"),
      body: doc.childNodes.toString(),
      datetime: datetime
    };
  })(),
  
  latestBlog: {
    url: "/fun/poopbuttsuck/",
    preview: "<p>No blogs yet. Here's a link to PoopButtSuck for now.</p>"
  },
  webrings: [ { class: "webring-class", content: "This is webring content." } ],
  blinkies: await (async () => {
    const path = "content/blinkie/list.yaml";

    const file = await Dir.readFile(path);
    const yaml = Object.entries(Yaml.parse(file));

    for (const [ image ] of yaml) {
      Dir.copyFile(
        Path.join("content/blinkie/image", image),
        Path.join("res/blinkie", image)
      );
    }

    return yaml.map(([ image, href ]) => ({
      image: Path.join("/res/blinkie", image),
      href: href
    }));
  })(),
  usefulPages: [ { title: "This is a title.", href: "https://butt/" } ],
  todo: await (async () => {
    const filePath = "TODO.md";

    const file = await Dir.readFile(filePath);
    const parsed = Marked.parse(file, {
      async: true,
      gfm: true
    });
      
    return parsed;
  })()
}))();

template.then(async template => {
  const html = await Dir.readFile("src/index.html");

  const tbrush = Tbrush.compose(html);
  const final = tbrush.apply(template);

  Dir.writeFile("index.html", final);
});

