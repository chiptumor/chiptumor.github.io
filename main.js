import * as main from "/util/index.js";
await main.addMenubar();
await main.addTitle();
await main.addClickToCopy();

import * as Lucide from "https://unpkg.com/lucide@latest";
// TODO: check if namespace or default import
window.addEventListener("load", Lucide.createIcons);