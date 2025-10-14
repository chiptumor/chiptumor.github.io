function cycle(nodes, parent) {
	for (const node of nodes) {
		switch (node.tagName) {
			case "text": {
				const element = document.createElement("div");

				element.className = node.className;
				element.classList.add("item", "text");
				element.innerHTML = "<span>" + node.innerHTML + "</span>";

				element.setAttribute("data-title", node.getAttribute("title") || "");
				element.setAttribute("data-desc",  node.getAttribute("desc")  || "");
				parent.append(element);
			} break;
			case "url": {
				const element = document.createElement("a");
				
				element.className = node.className;
				element.classList.add("item", "url");
				element.innerHTML = "<span>" + node.innerHTML + "</span>";
				if (
					new URL(node.getAttribute("href"), window.location.origin).pathname
						=== window.location.pathname
				) element.classList.add("located");
				if (URL.parse(node.getAttribute("href"))) element.setAttribute("target", "_blank");

				element.setAttribute("href",       node.getAttribute("href")  || "");
				element.setAttribute("data-title", node.getAttribute("title") || "");
				element.setAttribute("data-desc",  node.getAttribute("desc")  || "");
				parent.append(element);
			} break;
			case "copy": {
				const element = document.createElement("div");
				
				element.className = node.className;
				element.classList.add("item", "copy");
				element.innerHTML = "<span>" + node.innerHTML + "</span>";
				
				element.setAttribute("data-copy",  node.getAttribute("value") || "");
				element.setAttribute("data-title", node.getAttribute("title") || "");
				element.setAttribute("data-desc",  node.getAttribute("desc")  || "");

				parent.append(element);
			} break;
			case "dropdown": {
				const element = document.createElement("div");

				element.className = node.className;
				element.classList.add("dropdown");
				if (
					new URL(node.getAttribute("href"), window.location.origin).pathname
						=== window.location.pathname
				) element.classList.add("located");

				const text = node.childNodes[0];
				if (text.nodeType === 3) {
					const span = document.createElement("span");
					span.innerHTML = text.nodeValue.trim();
					element.append(span);
				}

				const child = document.createElement("div");
				child.classList.add("content");
				element.append(child);

				cycle(node.children, child);
				parent.append(element);
			} break;
			default: {
				console.warn("addMenubar: Unrecognized tag name!", node);
			}
		}
	}
}

export async function addMenubar() {
	console.time("Create Menubar");

	window.addEventListener("load", async () => {
		const xml = await fetch("/util/resource/menubar.xml")
			.then(response => response.text())
			.then(text => new DOMParser().parseFromString(text, "text/xml"));
		const menubar = document.createElement("div");
		menubar.setAttribute("id", "menubar");

		const element = document.createElement("div");
		element.classList.add("content");
		menubar.append(element);
		
		cycle(xml.documentElement.children, element);

		document.body.prepend(menubar);
	});
	
	console.timeEnd("Create Menubar");
};