function cycle(nodes, parent) {
	for (const node of nodes) {
		const element = document.createElement("li");
		
		if (node.className) element.className = node.className;

		node.getAttribute("title") &&
			element.setAttribute("data-title", node.getAttribute("title") || "");
		node.getAttribute("desc")  &&
			element.setAttribute("data-desc",  node.getAttribute("desc")  || "");

		switch (node.tagName) {
			case "text": {
				element.innerHTML = "<span>" + node.innerHTML + "</span>";
			} break;
			case "url": {
				const anchor = document.createElement("a");
				
				if (URL.parse(node.getAttribute("href"))) anchor.setAttribute("target", "_blank");
				anchor.innerHTML = "<span>" + node.innerHTML + "</span>";

				anchor.setAttribute("href", node.getAttribute("href") || "");

				element.append(anchor);
			} break;
			case "copy": {
				element.innerHTML = "<span>" + node.innerHTML + "</span>";
				
				element.setAttribute("data-copy",  node.getAttribute("value") || "");
			} break;
			case "dropdown": {
				const text = node.childNodes[0];
				if (text.nodeType === 3) {
					const span = document.createElement("span");
					span.innerHTML = text.nodeValue.trim();
					element.append(span);
				} else console.error("addMenubar: Dropdown tag doesn't have beginning text node.");

				const child = document.createElement("menu");
				element.append(child);

				cycle(node.children, child);
			} break;
			default: {
				console.warn("addMenubar: Unrecognized tag name.", node);
			}
		}

		parent.append(element);
	}
}

import * as player from "/util/module/player.js";

export async function addMenubar(options) {
	console.time("Create Menubar");

	window.addEventListener("load", async () => {
		const xml = await fetch("/util/resource/menubar.xml")
			.then(response => response.text())
			.then(text => new DOMParser().parseFromString(text, "text/xml"));
		const menubar = document.createElement("div");
		menubar.setAttribute("id", "menubar");

		const menu = document.createElement("menu");
		menubar.append(menu);
		
		cycle(xml.documentElement.children, menu);

		document.body.prepend(menubar);
		
		if (options.player) {
			const xml = await fetch("/util/resource/player.xml")
				.then(response => response.text())
				.then(text => new DOMParser().parseFromString(text, "text/xml"));
				
			const element = document.createElement("div");
			element.setAttribute("class", "player");
			menubar.append(element);

			element.innerHTML = xml.documentElement.innerHTML;

			await player.setPlayer();
		}

		console.timeEnd("Create Menubar");
	});
};