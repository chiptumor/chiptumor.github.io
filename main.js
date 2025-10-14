import * as main from "/util/module/index.js";
await main.addColorStyles();
await main.addTitle();
await main.setClickToCopy();
await main.addMenubar();
await main.addPlayer({ menubar: true });
await main.setPfp();

// ANNOUNCEMENT
window.addEventListener("load", async () => {
	// DISPLAY CONTENT
	const content = await fetch("/content/announcement.xml", { cache: "no-cache" })
		.then(response => response.text())
		.then(text => new DOMParser().parseFromString(text, "text/xml"));

	document.querySelector("#grid div.announcement").setAttribute("data-visible",
		content.documentElement.getAttribute("visible"));
	document.querySelector("[data-content='announcement/preview/content']").innerHTML
		= content.getElementsByTagName("preview")[0].innerHTML;
	document.querySelector("[data-content='announcement/body/content']").innerHTML
		= content.getElementsByTagName("body")[0].innerHTML;
	

	// DISPLAY DATE
	const [{ commit: { author: { date: dateString }}}] = await fetch(
		"https://api.github.com/repos/chiptumor/chiptumor.github.io/commits?path=content/announcement.xml&page=1&per_page=1"
	).then(response => response.json());

	const date = new Date(dateString);
	
	const timeAgo = new TimeAgo("en-US");

	const relative = timeAgo.format(date.getTime());
	const locale = date.toLocaleString();

	document.querySelector("[data-content='announcement/preview/date']").textContent
		= relative;
	document.querySelector("[data-content='announcement/body/date']").textContent
		= locale;


	// TOGGLE OPEN/CLOSE
	const banner = document.querySelector("#grid div.announcement");
	const button = banner.querySelector("div.open-close");

	banner.addEventListener("click", () => {
		if (banner.getAttribute("data-open") === "false")
			banner.setAttribute("data-open", "true");
	});

	button.addEventListener("click", (event) => {
		if (banner.getAttribute("data-open") === "true") {
			banner.setAttribute("data-open", "false");
			event.stopPropagation();
		}
	});
});

// GREETING
window.addEventListener("load", () => {
	const element = document.querySelector("#grid div.welcome h1.greeting");
	const content = element.textContent;
	element.innerHTML = "";

	const diff = -200;

	const length = (content.length * diff) - diff;

	for (const character in content) {
		const delay = length - (character * diff);
		const span = document.createElement("span");
		span.style.animationDelay = `${delay}ms`;
		span.textContent = content[character];
		element.append(span);
	}
});

// STATUS
window.addEventListener("load", async () => {
	// DISPLAY CONTENT
	const content = await fetch("/content/status.xml", { cache: "no-cache" })
		.then(response => response.text())
		.then(text => new DOMParser().parseFromString(text, "text/xml"));

	document.querySelector("[data-content='status/imFeeling']").innerHTML
		= content.getElementsByTagName("imFeeling")[0].innerHTML;
	document.querySelector("[data-content='status/body']").innerHTML
		= content.getElementsByTagName("body")[0].innerHTML;
	
	// DISPLAY DATE
	const [{ commit: { author: { date: dateString }}}] = await fetch(
		"https://api.github.com/repos/chiptumor/chiptumor.github.io/commits?path=content/status.xml&page=1&per_page=1"
	).then(response => response.json());

	const date = new Date(dateString);
	
	const timeAgo = new TimeAgo("en-US");

	const relative = timeAgo.format(date.getTime());
	const locale = date.toLocaleString();

	document.querySelector("[data-content='status/date/relative']").textContent
		= relative;
	document.querySelector("[data-content='status/date/locale']").textContent
		= locale;
});

// TODO LIST
window.addEventListener("load", async () => {
	const file = await fetch("/todo.md", { cache: "no-cache" })
		.then(response => response.text());

	document.querySelector("[data-content='todo/content']").innerHTML
		= marked.parse(file);
});