import { defineConfig } from "vite";
import { glob } from "glob";
import * as FileSystem from "node:fs/promises";

import { Octokit } from "octokit";
import { DOMParser } from "@xmldom/xmldom";

const octokit = new Octokit();

({
    content: {
        opengraph: {
            avatar
        },
        menubar: {
            playlist
        },
        marquee: {
            visible,
            summary,
            details
        },
        status: {
            feeling,
            body
        },
        social: {
            discord: {
                profile
            }
        },
        todo
    }
});

const handlebar = {
    content: {
        opengraph: {
            avatar: await (async () => {
                const { generic: { icon: { zoologist: array }}} =
                    await octokit.request("GET /repos/{owner}/{repo}/contents/{path}", {
                        owner: "chiptumor",
                        repo: "chiptumor",
                        path: "main/res/profile/rest.json",
                        headers: {
                            "X-GitHub-Api-Version": "2022-11-28",
                            "accept": "application/vnd.github.raw+json"
                        }
                    })
                    .then(response => response.json());
                return array[Math.floor(Math.random() * array.length)].path;
            })()
        },
        marquee: await (async () => {
            const xml =
                await FileSystem.readFile("./content/marquee.xml", "utf8")
                .then(file => new DOMParser().parseFromString(file, "text/xml"));
            return {
                visible: xml.documentElement.getAttribute("visible"),
                summary: xml.getElementsByTagName("preview")[0].nodeValue,
                details: xml.getElementsByTagName("body")[0].nodeValue
            };
        })(),
        status: await (async () => {
            const xml =
                await FileSystem.readFile("./content/status.xml", "utf8")
                .then(file => new DOMParser().parseFromString(file, "text/xml"));
            return {
                feeling: xml.getElementsByTagName("imFeeling")[0].nodeValue,
                body: xml.getElementsByTagName("body")[0].nodeValue
            };
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