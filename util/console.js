console.log = (...message) => log("log", ...message);
console.info = (...message) => log("info", ...message);
console.debug = (...message) => log("debug", ...message);
console.warn = (...message) => log("warn", ...message);
console.error = (...message) => log("error", ...message);

function log(type, ...messages) {
	const consoleElement = document.getElementById("console");

	const element = document.createElement("div");
	element.className = type;
	const message = messages.map(message => typeof message === "object"
		? JSON.stringify(message, null, 4)
		: message
	).join(" ");
	element.textContent = message;
	consoleElement.append(element);
}