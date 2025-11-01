export async function setPfp() {
	console.time("Set PFP");
	window.addEventListener("load", async () => {
		const anchor = document.querySelector("a[data-content='pfp/anchor']");
		const image = anchor?.querySelector("img[data-content='pfp/image']");

		if (!image) {
			const example = document.createElement("a");
			example.setAttribute("data-content", "pfp/anchor");
			const exampleChild = document.createElement("img");
			exampleChild.setAttribute("data-content", "pfp/image");
			example.append(exampleChild);
			
			if (!anchor) {
				console.warn([
					"No anchor element with data-content attribute 'pfp/anchor'.",
					"Make sure you're implementing the PFP elements with an anchor element.",
					"Example:"
				].join("\n"), example);
			} else {
				console.warn([
					"No image element with data-content attribute 'pfp/image' under anchor element.",
					"Make sure you're implementing the PFP elements with an image element.",
					"Example:"
				].join("\n"), example);
			}

			return;
		}

		const json = await fetch("/util/resource/pfp.json")
			.then(response => response.json());

		const today = new Date();

		const pfp =
			// safe mode
			safe ? json.chip.tumor
			// october
			: today.getMonth() === 9 ? json.event.october
			// else
			: json.default[Math.floor(Math.random() * json.default.length)];

		pfp.source && anchor.setAttribute("href",      pfp.source);
		pfp.artist && anchor.setAttribute("data-desc", pfp.artist);
		pfp.image  && image .setAttribute("src",       pfp.image );
		pfp.artist && image .setAttribute("alt",       pfp.artist);
		
		console.timeEnd("Set PFP");
	});
}