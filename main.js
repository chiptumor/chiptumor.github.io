import * as main from "/util/module/index.js";
await main.addColorStyles();
await main.addMenubar();
await main.addPlayerToMenubar();
await main.addTitle();
await main.addClickToCopy();

import * as Lucide from "https://unpkg.com/lucide@latest";
// TODO: check if namespace or default import
window.addEventListener("load", Lucide.createIcons);

// ANNOUNCEMENT
window.addEventListener("load", async () => {
	// https://api.github.com/repos/chiptumor/chiptumor.github.io/commits?path=content/announcement.xml&page=1&per_page=1
});

// STATUS
window.addEventListener("load", async () => {
	// https://api.github.com/repos/chiptumor/chiptumor.github.io/commits?path=content/status.xml&page=1&per_page=1
});