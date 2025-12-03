import { defineConfig } from "vite";
import { glob } from "glob";
import * as Path from "path";
import * as FileSystem from "node:fs/promises";

import { Octokit } from "octokit";
import { XMLParser } from "fast-xml-parser";

const octokit = new Octokit();

const handlebar = {
    opengraph: {
        pfp:
            await octokit.request("GET /repos/{owner}/{repo}/contents/{path}", {
                owner: "chiptumor",
                repo: "chiptumor",
                path: "main/res/profile/rest.json",
                headers: {
                    "X-GitHub-Api-Version": "2022-11-28",
                    "accept": "application/vnd.github.raw+json"
                }
            })
                .then(response => response.json())
                .then(({ generic: { icon: { zoologist: array }}}) =>
                    array[Math.floor(Math.random() * array.length)].path
                )
    },
    content: {
        marquee: await (async () => {
            
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

                const response = octokit.request("GET /repos/{owner}/{repo}/contents/{path}", {
                    owner: "chiptumor",
                    repo: "chiptumor.github.io",
                    path: "todo.md",
                    headers: {
                        "X-GitHub-Api-Version": "2022-11-28"
                    }
                })
            }
        }
    ],
    build: {
        rollupOptions: {
            input: glob.sync("src/**/*.html")
        }
    }
})