import * as FileSystem from "node:fs/promises";
import * as TBrush from "https://esm.sh/gh/chiptumor/tbrush/src/index.ts";
import { DOMParser } from "@xmldom/xmldom";
import * as Yaml from "yaml";

const domParser = new DOMParser();

const parse = {
  xml: (string) => domParser.parseFromString(string)
};

const template = {
  greeting: "Haio!!",
  banner: {
    summary: "string",
    body: "string",
    absoluteDate: "string"
  },
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

