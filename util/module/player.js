export async function addPlayer(options) {
	if (options.menubar) {
		window.addEventListener("load", async () => {
			const element = document.getElementById("menubar");
			if (!element) throw new Error("No menubar element found.");

			const xml = await fetch("/util/resource/player.xml")
				.then(response => response.text())
				.then(text => new DOMParser().parseFromString(text, "text/xml"));
			
		});
	}
};