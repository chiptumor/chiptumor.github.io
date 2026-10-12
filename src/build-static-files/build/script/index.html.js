import * as Path from "node:path";

import * as Marked from "marked";
import * as Tbrush from "../../../../lib/tbrush/index.ts.mjs";
import * as Xmldom from "@xmldom/xmldom";
import * as Yaml from "yaml";

import CONFIG from "../../config.js";
import * as Dir from "../../util/dir.js";

const domParser = new Xmldom.DOMParser();

/**
 * Intended for banner and status, which share a similar process.
 * @param {string} dir
 */
async function getDomAndDate(dir) {
  const files = await Dir.readDir(Dir.root(dir));
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

const template = {};

template.greeting = "Haio!!";

template.portrait = await (async () => {
  const path = "content/portrait/list.yaml";
  const file = await Dir.readFile(Dir.root(path));
  const yaml = Yaml.parse(file);
  const list = Object.entries(yaml);

  const [ fileName, details ]
    = list[Math.floor(Math.random() * list.length)];

  await Dir.copyFile(
    Dir.root("content/portrait/image", fileName),
    "res/portrait.png"
  );

  return details;
})();

template.avatar = await (async () => {
  const path = "content/avatar/list.yaml";
  const file = await Dir.readFile(Dir.root(path));
  const yaml = Yaml.parse(file);
  
  const today = new Date();
  const list = Object.entries(
    today.getMonth() === 9
      ? yaml.festive.halloween
      : yaml.default
  );
  
  const [ fileName, details ]
    = list[Math.floor(Math.random() * list.length)];
  
  await Dir.copyFile(
    Dir.root("content/avatar/image", fileName),
    "res/avatar.png"
  );
  
  return details;
})();

template.banner = await (async () => {
  const path = "content/banner/";

  const { dom, datetime } = await getDomAndDate(path);

  const fromTagName = (tagName) =>
    dom.getElementsByTagName(tagName)[0].childNodes.toString();

  return {
    summary: fromTagName("summary"),
    body: fromTagName("body"),
    datetime: datetime
  };
})();

template.status = await (async () => {
  const path = "content/status/";

  const { dom, datetime } = await getDomAndDate(path);
  const doc = dom.documentElement;
  
  return {
    feeling: doc.getAttribute("feeling"),
    body: doc.childNodes.toString(),
    datetime: datetime
  };
})();

template.latestBlog = {
  url: "/fun/poopbuttsuck/",
  preview:
    "<p>No blogs yet. \"Read full blog...\" will take you to PoopButtSuck for"
    + " the time being.</p>"
};

template.webrings = [{
  class: "webring-class",
  content: "This will be webring content."
}];

template.blinkies = await (async () => {
  const path = "content/blinkie/list.yaml";

  const file = await Dir.readFile(Dir.root(path));
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
})();

template.todo = await (async () => {
  const filePath = "TODO.md";

  const file = await Dir.readFile(Dir.root(filePath));
  const markdown = Marked.parse(file, {
    async: true,
    gfm: true
  });
    
  return markdown;
})();

const buildData = {
  bannerDate: template.banner.datetime,
  statusDate: template.status.datetime,
  splashes: await (async () => {
    const filePath = "content/splash.yaml";
    
    const file = await Dir.readFile(Dir.root(filePath));
    const yaml = Yaml.parse(file);
    
    const final = compile(yaml);
    return final;
    
    function compile(yaml) {
      const array = [];
      
      for (const item of yaml)
        if (typeof item === "string")
          array.push(item);
        else if (item.splashes)
          array.push(compile(item.splashes));

      return array;
    }
  })(),
  playlist: await (async () => {
    const filePath = "content/playlist/list.yaml";

    const file = await Dir.readFile(Dir.root(filePath));
    const yaml = Yaml.parse(file);

    for (const key in yaml)
      yaml[key].comments = Marked.parse(yaml[key].comments);
    
    return yaml;
  })()
};

template.buildData = JSON.stringify(buildData);

const html = await Dir.readFile(Dir.file("index.html"));

const tbrush = Tbrush.compose(html);
const final = tbrush.apply(template);

Dir.writeFile("index.html", final);
