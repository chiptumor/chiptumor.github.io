import replace from "../util/script/replace.js";
import TimeAgo from "../util/module/timeago.js";

const json = await ( 
    Promise.all(
        [
            "https://api.github.com/repos/chiptumor/chiptumor.github.io/commits?per_page=1",
            "https://api.github.com/repos/chiptumor/chiptumor.github.io/commits?path=content/marquee.xml&per_page=1",
            "https://api.github.com/repos/chiptumor/chiptumor.github.io/commits?path=content/status.xml&per_page=1",
            "https://raw.githubusercontent.com/chiptumor/chiptumor/main/res/profile/rest.json"
        ]
        .map(item => fetch(item).then(response => response.json()))
    )
    .then(
        ([ site, marquee, status, avatar ]) =>
        ({ site, marquee, status, avatar })
    )
);

const template = {
    content: {
        site: {
            updated: (() => {
                const string = json.site[0].commit.author.date;
                const date = new Date(string);
                return {
                    value: string,
                    relative: TimeAgo.format(date.getTime()),
                    locale: date.toLocaleString()
                };
            })()
        },
        marquee: {
            time: (() => {
                const string = json.marquee[0].commit.author.date;
                const date = new Date(string);
                return {
                    value: string,
                    relative: TimeAgo.format(date.getTime()),
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
                    relative: TimeAgo.format(date.getTime()),
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
