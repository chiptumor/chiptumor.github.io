import "https://unpkg.com/javascript-time-ago@2.5.12/bundle/javascript-time-ago.js";

await fetch("https://unpkg.com/javascript-time-ago@2.5.12/locale/en.json")
    .then(response => response.json()).then(en => TimeAgo.addDefaultLocale(en));

export const TimeAgo = TimeAgo;
