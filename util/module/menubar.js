function dropdown(node) {

};

export async function addMenubar() {
	console.time("Create Menubar");
	const menubar = await fetch("/util/module/resource/menubar.xml")
		.then(response => response.text())
		.then(text => new DOMParser().parseFromString(text, "text/xml"));

	const element = document.createElement("div");
	element.setAttribute("id", "menubar");

	for (const node of menubar.documentElement.children) {
		if (node.tagName === "dropdown") {}
	}

	console.timeEnd("Create Menubar");
};