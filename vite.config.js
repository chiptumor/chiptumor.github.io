import { defineConfig } from "vite";
import dotenv from "dotenv";
import { glob } from "glob";
import { JSDOM } from "jsdom";
import * as FileSystem from "node:fs/promises";
import { Marked } from "marked";

dotenv.config();

async function github({ repo, path }) {
    return await fetch(`https://raw.githubusercontent.com/${repo}/${path}`);
}

function parseXML(string) {
    return new JSDOM(string, { contentType: "text/xml" });
}

const marked = new Marked();
function parseMD(string) {
    return marked.parse(string, { gfm: true });
}

const template = {
    content: {
        profile: {
            avatar: await (async () => {
                const { generic: { icon: { zoologist: array }}} =
                    await github({
                        repo: "chiptumor/chiptumor",
                        path: "main/res/profile/rest.json"
                    })
                    .then(response => response.json());
                return array[Math.floor(Math.random() * array.length)];
            })()
        },
        header: {
            splash: await (async () => {
                const array = await FileSystem.readFile("./content/splash.txt", "utf8")
                    .then(string => string.split("\n"));
                return array[Math.floor(Math.random() * array.length)];
            })()
        },
        menubar: await (async () => {
            const element = await FileSystem.readFile("./lib/menubar.inc", "utf8");
            return element;
        })(),
        marquee: await (async () => {
            const document =
                await FileSystem.readFile("./content/marquee.xml", "utf8")
                .then(file => parseXML(file).window.document);
            return {
                visible: document.documentElement.getAttribute("visible"),
                summary: document.getElementsByTagName("preview")[0].innerHTML,
                details: document.getElementsByTagName("body")[0].innerHTML
            };
        })(),
        status: await (async () => {
            const document =
                await FileSystem.readFile("./content/status.xml", "utf8")
                .then(file => parseXML(file).window.document);
            return {
                feeling: document.getElementsByTagName("imFeeling")[0].innerHTML,
                body: document.getElementsByTagName("body")[0].innerHTML
            };
        })(),
        social: {
            discord: {
                profile: await (async () => {
                    const me =
                        await fetch("https://discord.com/api/v10/users/1184619891215573042/profile", { headers: {
                            Authorization: process.env.DISCORD_AUTHORIZATION
                        }})
                        .then(response => response.json());

                    return {
                        id: me.user.id,
                        username: me.user.username,
                        nickname: me.user.global_name,
                        avatar: `https://cdn.discordapp.com/avatars/${me.user.id}/${me.user.avatar}.png`,
                        bannerColor: me.user.banner_color,
                        bio: marked.parse(me.user.bio, { breaks: true })
                    }
                })()
            }
        },
        todo: await (async () => {
            const markdown =
                await FileSystem.readFile("./todo.md", "utf8")
                .then(file => parseMD(file));
            return markdown;
        })()
    }
};

const viteConfig = defineConfig({
    preview: {
        port: 6767
    },
    build: {
        emptyOutDir: true,
        assetsInlineLimit: 0,
        sourcemap: true,
        rollupOptions: {
            input: [
                ...glob.sync("src/**/*.html")
            ]
        }
    },
    css: {
        devSourcemap: true
    },
    plugins: [
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
});

import lucidePreprocess from "vite-plugin-lucide-preprocess";

viteConfig.plugins.push(
    lucidePreprocess()
);

export default defineConfig(viteConfig);
