export async function setPlayer(options) {
	console.time("Set player");

	window.addEventListener("load", async () => {

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

		console.timeEnd("Set player");
	});


};