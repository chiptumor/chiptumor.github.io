import { defineConfig } from "vite";
import { glob } from "glob";
import { JSDOM } from "jsdom";
import * as FileSystem from "node:fs/promises";
import * as Parse5 from "parse5";
import { DOMParser } from "@xmldom/xmldom";

async function github({ repo, path }) {
    return await fetch(`https://raw.githubusercontent.com/${repo}/${path}`);
}

function parseDOM(string) {
    return new JSDOM(string, { contentType: "text/xml" });
}

const template = {
    content: {
        opengraph: {
            avatar: await (async () => {
                const { generic: { icon: { zoologist: array }}} =
                    await github({
                        repo: "chiptumor/chiptumor",
                        path: "main/res/profile/rest.json"
                    })
                    .then(response => response.json());
                return array[Math.floor(Math.random() * array.length)].path;
            })()
        },
        menubar: await (async () => {
            const element = await FileSystem.readFile("./lib/menubar.inc", "utf8");
            return element;
        })(),
        marquee: await (async () => {
            const document =
                await FileSystem.readFile("./content/marquee.xml", "utf8")
                .then(file => parseDOM(file).window.document);
            return {
                visible: document.documentElement.getAttribute("visible"),
                summary: document.getElementsByTagName("preview")[0].innerHTML,
                details: document.getElementsByTagName("body")[0].innerHTML
            };
        })(),
        status: await (async () => {
            const document =
                await FileSystem.readFile("./content/status.xml", "utf8")
                .then(file => parseDOM(file).window.document);
            return {
                feeling: document.getElementsByTagName("imFeeling")[0].innerHTML,
                body: document.getElementsByTagName("body")[0].innerHTML
            };
        })(),
        social: {
            discord: {
                profile: await (async () => {

                })()
            }
        },
        todo: await (async () => {

        })()
    }
};

import lucidePreprocess from "vite-plugin-lucide-preprocess";

export default defineConfig({
    build: {
        emptyOutDir: true,
        assetsInlineLimit: 0,
        rollupOptions: {
            input: glob.sync("src/**/*.x?html")
        }
    },
    plugins: [
        lucidePreprocess(),
        
        {
            name: "convert-xhtml-to-html",
            enforce: "pre",
            async load(id) {
                if (!id.match(/\.xhtml$/)) return null;
                const file = await FileSystem.readFile(id, "utf8");
                const document = new DOMParser().parseFromString(file, "application/xml");
                const html = Parse5.serialize(Parse5.parse(document.toString()));
                return `export default ${JSON.stringify(html)};`;
            }
        },
        {
            name: "replace-templates",
            transformIndexHtml(html) {
                const regex = /\{\{\s*([\w.]+)\s*\}\}/g;
                return html.replace(regex, (match, path) => {
                    const value = path.split(".").reduce((obj, key) => obj?.[key], template);
                    return value ?? match;
                    // TODO: convert client templates to elements
                });
            }
        },
        {
            name: "remove-src-dir-from-path",
            enforce: "post",
            generateBundle(_, bundle) {
                const regex = /^src\//;
                for (const item of Object.values(bundle)) {
                    if (!regex.test(item.fileName)) continue;
                    item.fileName = item.fileName.replace(regex, "");
                }
            }
        }
    ]
})