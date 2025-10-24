export function setClickToCopy() {
	window.addEventListener("click", async (event) => {
		const element = event.target.closest("[data-copy]");
		if (element) {
			const title = document.getElementById("title");

			try {
				navigator.clipboard.writeText(element.getAttribute("data-copy"));
				title.classList.add("ctc-success");
			} catch(error) {
				console.error("Unable to copy text:", error);
				title.classList.add("ctc-failure");
			}

			setTimeout(() => {
				title.classList.remove("ctc-success", "ctc-failure");
			}, 1500);
		}
	});
};