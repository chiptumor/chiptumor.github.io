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

		const json = await fetch("https://chiptumor.github.io/chiptumor/res/profile/rest.json")
			.then(response => response.json());

		const today = new Date();

		const pfp =
			// safe mode
			safe ?
				randomItem(json.generic.icon.chip.tumor)
			// halloween
			: today.getMonth() === 9 ?
				randomItem(json.festive.halloween.icon.zoologist)
			// else
			: randomItem(json.generic.icon.zoologist);

		pfp.source && anchor.setAttribute("href",       pfp.source);
		pfp.artist && anchor.setAttribute("data-title", pfp.artist);
		pfp.path   && image .setAttribute("src",        pfp.path  );
		pfp.artist && image .setAttribute("alt",        pfp.artist);
		
		console.timeEnd("Set PFP");
	});
}

function randomItem(array) {
	return array[Math.floor(Math.random() * array.length)];
}