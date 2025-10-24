export async function addPlayer(options) {
	console.time("Add player");

	window.addEventListener("load", async () => {
		if (options.menubar) {
			const element = document.getElementById("menubar");
			if (!element) throw new Error("No menubar element found.");

			const xml = await fetch("/util/resource/player.xml")
				.then(response => response.text())
				.then(text => new DOMParser().parseFromString(text, "text/xml"));
			
			const menubar = document.getElementById("menubar");
			const element = document.createElement("div");
			element.setAttribute("class", "player");
			menubar.append(element);

			element.innerHTML = xml.documentElement.innerHTML;
		}

		const audio = document.getElementById("player/audio");

		const title = document.getElementById("player/title");
		const artist = document.getElementById("player/artist");
		const chip = document.getElementById("player/chip");
		const software = document.getElementById("player/software");

		const play = document.getElementById("player/play-pause");
		const prev = document.getElementById("player/prev");
		const next = document.getElementById("player/next");
		const reveal = document.getElementById("player/reveal");

		const elapsed = document.getElementById("player/elapsed");
		const remaining = document.getElementById("player/remaining");
		const total = document.getElementById("player/total");
		const progress = document.getElementById("player/progress");

		console.timeEnd("Add player");
	});


};