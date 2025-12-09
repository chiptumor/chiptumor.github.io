import { defineConfig } from "vite";
import { glob } from "glob";
import { JSDOM } from "jsdom";
import * as FileSystem from "node:fs/promises";
import * as Path from "node:path";
import * as Url from "node:url";


async function github({ repo, path }) {
    return await fetch(`https://api.github.com/repos/${repo}/contents/${path}`, {
        headers: {
            "x-GitHub-Api-Version": "2022-11-28",
            "accept": "application/vnd.github.raw+json"
        }
    });
}

function parseDOM(string) {
    return new JSDOM(string, { contentType: "text/xml" });
}

const handlebar = {
    content: {
        opengraph: {
            avatar: await (async () => {
                const { generic: { icon: { zoologist: array }}} =
                    await github({
                        repo: "chiptumor/chiptumor",
                        path: "res/profile/rest.json"
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

export default defineConfig({
    build: {
        emptyOutDir: true,
        assetsInlineLimit: 0,
        rollupOptions: {
            input: glob.sync("src/**/*.html"),
            external: [
                "javascript-time-ago"
            ]
        }
    },
    plugins: [
        {
            name: "replace-handlebars",
            transformIndexHtml(html) {
                const regex = /\{\{\s*([\w.]+)\s*\}\}/g;
                return html.replace(regex, (match, path) => {
                    const value = path.split(".").reduce((obj, key) => obj?.[key], handlebar);
                    return value ?? match;
                });
            }
        },
        {
            name: 'remove-src-dir-from-html-path',
            enforce: 'post',
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