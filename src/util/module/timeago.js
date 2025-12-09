import TimeAgo from "https://esm.sh/javascript-time-ago";

await fetch("https://esm.sh/javascript-time-ago/locale/en.json")
.then(TimeAgo.addDefaultLocale);

export default new TimeAgo("en-US");
