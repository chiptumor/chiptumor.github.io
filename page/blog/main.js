import * as main from "/util/module/index.js";
await main.addColorStyles();
await main.addTitle();
await main.setClickToCopy();
await main.addMenuBar();
await main.addPlayer({ menubar: true });