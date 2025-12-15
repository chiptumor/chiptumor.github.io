import { reduce, replace } from "../util/script/replace.js";
import TimeAgo from "../util/module/timeago.js";

const json = await ( 
    Promise.all(
        [
            fetch(
                "https://api.github.com/repos/chiptumor/chiptumor.github.io/issues?sort=updated&per_page=5"
            ),
            fetch(
                "https://api.github.com/repos/chiptumor/chiptumor.github.io/commits?per_page=5"
            ),
            fetch(
                "https://api.github.com/repos/chiptumor/chiptumor.github.io/commits?path=content/marquee.xml&per_page=1",
                { cache: "no-cache" }
            ),
            fetch(
                "https://api.github.com/repos/chiptumor/chiptumor.github.io/commits?path=content/status.xml&per_page=1",
                { cache: "no-cache" }
            ),
            fetch(
                "https://raw.githubusercontent.com/chiptumor/chiptumor/main/res/profile/rest.json"
            )
        ]
        .map(item => item.then(response => response.json()))
    )
    .then(
        ([ issues, commits, marquee, status, avatar ]) =>
        ({ issues, commits, marquee, status, avatar })
    )
);

const template = {
    content: {
        site: {
            issues: (() => {
                if (!json.issues.length) {
                    const element = document.createElement("p");
                    element.textContent = "No open issues currently. Hooray!";
                    return element;
                }
                const ul = document.createElement("ul");
                ul.classList.add("issues");
                for (const issue of json.issues) {
                    ul.innerHTML += [
                        `<li><a href="${issue.html_url}">`,
                            `<p>${issue.title}`,
                                `<time datetime="${issue.updated_at}">`,
                                    `${TimeAgo.format(new Date(issue.updated_at), "twitter")}`,
                                `</time>`,
                            `</p>`,
                        `</a></li>`
                    ].join("");
                }
                return ul;
            })(),
            commits: (() => {
                const ul = document.createElement("ul");
                ul.classList.add("commits");
                for (const { commit } of json.commits) {
                    ul.innerHTML += [
                        `<li><p>${commit.message}`,
                            `<time datetime="${commit.author.date}">`,
                                `${TimeAgo.format(new Date(commit.author.date), "twitter")}`,
                            `</time>`,
                        `</p></li>`
                    ].join("");
                }
                return ul;
            })()
        },
        marquee: {
            time: (() => {
                const string = json.marquee[0].commit.author.date;
                const date = new Date(string);
                return {
                    value: string,
                    relative: TimeAgo.format(date),
                    locale: date.toLocaleString()
                };
            })()
        },
        status: {
            time: (() => {
                const string = json.status[0].commit.author.date;
                const date = new Date(string);
                return {
                    value: string,
                    relative: TimeAgo.format(date),
                    locale: date.toLocaleString()
                };
            })()
        },
        avatar: (() => {
            const today = new Date();
            const avatar = (
                // if october
                today.getMonth() === 9 ?
                    randomItem(json.avatar.festive.halloween.icon.zoologist)
                : // else
                    randomItem(json.avatar.generic.icon.zoologist)
            );
            return {
                artist: avatar.artist,
                source: avatar.source,
                file: avatar.path
            };
            function randomItem(array) {
                return array[Math.floor(Math.random() * array.length)];
            }
        })()
    }
}

replace(template);
