import * as main from "/util/module/index.js";
await main.addColorStyles();
await main.addTitle();
await main.setClickToCopy();
await main.addMenubar();
await main.addPlayerToMenubar();
await main.setPfp();

import * as Lucide from "https://unpkg.com/lucide@latest";
// TODO: check if namespace or default import
window.addEventListener("load", Lucide.createIcons);

// TODO: implement relative times with package
// ANNOUNCEMENT
window.addEventListener("load", async () => {
	const content = await fetch("/content/announcement.xml")
		.then(response => response.text())
		.then(text => new DOMParser().parseFromString(text, "text/xml"));

	document.querySelector("#grid div.announcement").setAttribute("data-visible",
		content.getElementsByTagName("visible")[0].getAttribute("bool"));
	document.querySelector("[data-content='announcement/preview/content']").innerHTML
		= content.getElementsByTagName("preview")[0].innerHTML;
	document.querySelector("[data-content='announcement/body/content']").innerHTML
		= content.getElementsByTagName("body")[0].innerHTML;

	const [{ commit: { author: { date: dateString }}}] = await fetch(
		"https://api.github.com/repos/chiptumor/chiptumor.github.io/commits?path=content/announcement.xml&page=1&per_page=1"
	).then(response => response.json());
});

// GREETING
window.addEventListener("load", () => {
	const element = document.querySelector("#grid div.welcome h1.greeting");
	const content = element.textContent;
	element.innerHTML = "";

	const diff = -200;

	const length = (content.length * diff) + diff;

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
	// https://api.github.com/repos/chiptumor/chiptumor.github.io/commits?path=content/status.xml&page=1&per_page=1
});