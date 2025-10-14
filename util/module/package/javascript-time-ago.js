import TimeAgo from "https://unpkg.com/javascript-time-ago@2.5.12/index.cjs";

(async () =>
	await fetch("https://unpkg.com/javascript-time-ago@2.5.12/locale/en.json")
		.then(response => response.json()).then(en => TimeAgo.addDefaultLocale(en))
)();

const timeAgo = new TimeAgo("en-US");

export default timeAgo;