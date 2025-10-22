function cycle(nodes, parent) {
	for (const node of nodes) {
		const element = document.createElement("li");
		
		element.className = node.className;
		node.getAttribute("title") &&
			element.setAttribute("data-title", node.getAttribute("title") || "");
		node.getAttribute("desc")  &&
			element.setAttribute("data-desc",  node.getAttribute("desc")  || "");

		switch (node.tagName) {
			case "text": {
				element.innerHTML = "<span>" + node.innerHTML + "</span>";
			} break;
			case "url": {
				if (
					new URL(node.getAttribute("href"), window.location.origin).pathname
					=== window.location.pathname
				) element.classList.add("located");

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
				if (
					new URL(node.getAttribute("href"), window.location.origin).pathname
						=== window.location.pathname
				) element.classList.add("located");

				const text = node.childNodes[0];
				if (text.nodeType === 3) {
					const span = document.createElement("span");
					span.innerHTML = text.nodeValue.trim();
					element.append(span);
				} else console.warn("addMenubar: Dropdown tag doesn't have beginning text node.");

				const child = document.createElement("menu");
				child.classList.add("content");
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

export async function addMenubar() {
	console.time("Create Menubar");

	window.addEventListener("load", async () => {
		const xml = await fetch("/util/resource/menubar.xml")
			.then(response => response.text())
			.then(text => new DOMParser().parseFromString(text, "text/xml"));
		const div = document.createElement("div");
		div.setAttribute("id", "menubar");

		const menu = document.createElement("menu");
		div.append(menu);
		
		cycle(xml.documentElement.children, menu);

		document.body.prepend(div);
	});
	
	console.timeEnd("Create Menubar");
};