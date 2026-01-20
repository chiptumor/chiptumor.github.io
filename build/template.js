/* It's important to note that, because of how Vite handles building the site,
 * FileSystem functions parse paths as if the current directory is the root,
 * relative to vite.config.js. "./" is treated as the root instead of "../".
 */

import dotenv from "dotenv";
import * as FileSystem from "node:fs/promises";

import * as Entities from "html-entities";
import { JSDOM } from "jsdom";
import * as Commonmark from "commonmark";
import YAML from "yaml";

dotenv.config();

async function github({ repo, path }) {
    return await fetch(`https://raw.githubusercontent.com/${repo}/${path}`);
}

function replaceEntities(string) {
    const xmlEntities = [ "amp", "apos", "gt", "lt", "quot" ];
    const regex = /&(.+?);/g;
    return string.replace(regex, (match, entity) => {
        if (xmlEntities.includes(entity)) return match;
        else return Entities.decodeEntity(match);
    });
}

function parseXML(string) {
    return new JSDOM(replaceEntities(string), { contentType: "text/xml" });
}

const _mdReader = new Commonmark.Parser();
const _mdWriter = new Commonmark.HtmlRenderer();
function parseMD(string) {
    const parsed = _mdReader.parse(string);
    const walker = parsed.walker();

    // GFM alerts
    let event;
    while (event = walker.next()) {
        const bq = {
            in: false,
            type: "",
            title: ""
        };
        if (event.node.type === "block_quote") {
            if (event.entering) {
                bq.in = true;
            } else {
                bq.in = false;
                event.node.setAttribute
            }
        } else if (bq.in && event.node.type === "text") {
            const regex = /^\[!([\w\- ]+)\](?:(?= )(.*))?\n/;
            event.node.literal.replace(regex, (match, type, heading) => {
                bq.type = type;
                const title = heading.trim();
                if (title) bq.title = title;
                return "";
            });
        }
    }

    return _mdWriter.render(parsed);
}

const template = {
    content: {
        profile: {
            avatar:
                github({
                    repo: "chiptumor/chiptumor",
                    path: "main/res/profile/rest.json"
                })
                .then(response => response.json())
                .then(
                    ({ generic: { icon: { zoologist: array }}}) =>
                    array[Math.floor(Math.random() * array.length)]
                )
        },
        header: {
            splash:
                FileSystem.readFile("./content/splash.yaml", "utf8")
                .then(string => {
                    const file = YAML.parse(string);
                    return reduce(file.default);
                    
                    function reduce(array) {
                        const item = randIndex(array);
                        if (item.group) return reduce(item.splashes);
                        else return item
                            .replace(/<((?!\/>).+?)>/g, "<span class=\"splash-$1\">")
                            .replace(/<\/>/g, "</span>");
                    }
                    function randIndex(array) {
                        return array[Math.floor(Math.random() * array.length)];
                    }
                })
        },
        menubar:
            FileSystem.readFile("./build/include/menubar.html", "utf8"),
        marquee:
            FileSystem.readFile("./content/marquee.xml", "utf8")
            .then(file => {
                const document = parseXML(file).window.document;
                return {
                    visible: document.documentElement.getAttribute("visible"),
                    summary: document.getElementsByTagName("preview")[0].innerHTML,
                    details: document.getElementsByTagName("body")[0].innerHTML
                }
            }),
        status:
            FileSystem.readFile("./content/status.xml", "utf8")
            .then(file => {
                const document = parseXML(file).window.document;
                return {
                    feeling: document.getElementsByTagName("imFeeling")[0].innerHTML,
                    body: document.getElementsByTagName("body")[0].innerHTML
                };
            }),
        social: {
            discord: {
                profile:
                    fetch("https://discord.com/api/v10/users/1184619891215573042/profile", { headers: {
                        Authorization: process.env.DISCORD_AUTHORIZATION
                    }})
                    .then(response => response.json())
                    .then(me => ({
                        id: me.user.id,
                        username: me.user.username,
                        nickname: me.user.global_name,
                        avatar: `https://cdn.discordapp.com/avatars/${me.user.id}/${me.user.avatar}.png`,
                        bannerColor: me.user.banner_color,
                        bio: parseMD(me.user.bio.replace(/\n/, "  \n"))
                    }))
            }
        },
        todo:
            FileSystem.readFile("./todo.md", "utf8")
            .then(file => parseMD(file))
    }
};

export default template;
