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
            issues: (async () => {
                const url = "https://api.github.com/repos/chiptumor/chiptumor.github.io/issues?sort=updated&per_page=5";
                const issues = await fetch(url).then(response => response.json());
                if (!issues.length) {
                    const element = document.createElement("p");
                    element.textContent = "No open issues currently. Hooray!";
                    return element;
                }
                const ul = document.createElement("ul");
                ul.classList.add("issues");
                for (const issue of issues) {
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
            commits: (async () => {
                const url = "https://api.github.com/repos/chiptumor/chiptumor.github.io/commits?per_page=5";
                const commits = await fetch(url).then(response => response.json());
                const ul = document.createElement("ul");
                ul.classList.add("commits");
                for (const { commit } of commits) {
                    ul.innerHTML += [
                        `<li>${commit.message}`,
                            `<time datetime="${commit.author.date}">`,
                                `${TimeAgo.format(new Date(commit.author.date), "twitter")}`,
                            `</time>`,
                        `</li>`
                    ].join("");
                }
                return ul;
            })()
        },
        marquee: {
            time: (async () => {
                const url = "https://api.github.com/repos/chiptumor/chiptumor.github.io/commits?path=content/marquee.xml&per_page=1";
                const [{ commit: { author: { date: string }}}] =
                    await fetch(url, { cache: "no-cache" })
                    .then(response => response.json());
                const date = new Date(string);
                return {
                    value: string,
                    relative: TimeAgo.format(date),
                    locale: date.toLocaleString()
                };
            })()
        },
        status: {
            time: (async () => {
                const url = "https://api.github.com/repos/chiptumor/chiptumor.github.io/commits?path=content/status.xml&per_page=1";
                const [{ commit: { author: { date: string }}}] =
                    await fetch(url, { cache: "no-cache" })
                    .then(response => response.json());
                const date = new Date(string);
                return {
                    value: string,
                    relative: TimeAgo.format(date),
                    locale: date.toLocaleString()
                };
            })()
        }
    }
}

replace(template);
