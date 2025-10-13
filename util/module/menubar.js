function cycle(nodes) {
    for (const node of nodes) switch (node.tagName) {
        case "text": {
            
        } break;
        case "url": {
            
        } break;
        case "copy": {
            
        } break;
        case "dropdown": {
            
        } break;
    }
}

export async function addMenubar() {
	console.time("Create Menubar");
	const xml = await fetch("/util/module/resource/menubar.xml")
		.then(response => response.text())
		.then(text => new DOMParser().parseFromString(text, "text/xml"));

	const element = document.createElement("div");
	element.setAttribute("id", "menubar");
    
    const menubar = cycle(xml.documentElement.children);

	console.timeEnd("Create Menubar");
};