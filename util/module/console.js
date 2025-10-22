const keys = [
	"log",
	"info",
	"debug",
	"warn",
	"error"
];

const original = {};
for (const key of keys) {
	original[key] = console[key].bind(console);
	console[key] = (...message) => log(key, ...message);
}

const consoleElement = document.createElement("div");
consoleElement.id = "console";

function log(type, ...messages) {
	original[type](...messages);
	const element = document.createElement("div");
	element.className = type;
	const message = messages.map(message => message instanceof Object
		? JSON.stringify(message, null, 4)
		: message
	).join(" ");
	element.textContent = message;
	consoleElement.append(element);
}

window.addEventListener("load", () => document.body.prepend(consoleElement));

window.addEventListener("error", (event) => {
	event.preventDefault();
	window.alert(JSON.stringify(event, null, 4)); // DEBUG
	log("error", `${event.message}\n${event.filename} (${event.lineno}:${event.colno})`);
});

window.addEventListener("unhandledRejection", (event) => {
	event.preventDefault();
	log("error", event.reason);
});