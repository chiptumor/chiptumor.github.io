import { defineConfig } from "vite";
import { glob } from "glob";
import * as FileSystem from "node:fs/promises";

import { Octokit } from "octokit";
import { JSDOM } from "jsdom";

const octokit = new Octokit();
async function github({ repo, path }) {
    return await octokit.request("GET /repos/{repo}/contents/{path}", {
        repo, path,
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
            const xml =
                await FileSystem.readFile("./content/marquee.xml", "utf8")
                .then(file => parseDOM(file));
            return {
                visible: xml.documentElement.getAttribute("visible"),
                summary: xml.getElementsByTagName("preview")[0].innerHTML,
                details: xml.getElementsByTagName("body")[0].innerHTML
            };
        })(),
        status: await (async () => {
            const xml =
                await FileSystem.readFile("./content/status.xml", "utf8")
                .then(file => parseDOM(file));
            return {
                feeling: xml.getElementsByTagName("imFeeling")[0].innerHTML,
                body: xml.getElementsByTagName("body")[0].innerHTML
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
    plugins: [
        {
            name: "replace-handlebars",
            async transformIndexHtml(html) {
                const regex = /\{\{\s*([\w.]+)\s*\}\}/g;
                return html.replace(regex, (match, path) => {
                    const value = path.split(".").reduce((obj, key) => obj?.[key], handlebar);
                    return value ?? match;
                });
            }
        }
    ],
    build: {
        rollupOptions: {
            input: glob.sync("src/**/*.html")
        }
    }
})