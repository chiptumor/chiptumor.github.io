export function addTitle() {
	console.time("Add Title");
	
	window.addEventListener("load", () => {
		const element = document.createElement("div");
		element.setAttribute("id", "title");

		const title = document.createElement("span");
		title.classList.add("title");
		const desc = document.createElement("span");
		desc.classList.add("desc");
		const ctc = document.createElement("span");
		ctc.classList.add("ctc");

		const ctcSuccess = document.createElement("span");
		ctcSuccess.classList.add("success");
		ctcSuccess.innerHTML =
			`<svg
				xmlns="http://www.w3.org/2000/svg"
				width="20" height="20" viewBox="0 0 24 24"
				fill="none" stroke="currentColor"
				stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
				data-lucide="clipboard-check" class="lucide lucide-clipboard-check"
			>
				<rect width="8" height="4" x="8" y="2" rx="1" ry="1"></rect>
				<path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
				<path d="m9 14 2 2 4-4"></path>
			</svg>
			Copied!`;
		const ctcFailure = document.createElement("span");
		ctcFailure.classList.add("failure");
		ctcFailure.innerHTML =
			`<svg
				xmlns="http://www.w3.org/2000/svg"
				width="20" height="20" viewBox="0 0 24 24"
				fill="none" stroke="currentColor"
				stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
				data-lucide="clipboard-x" class="lucide lucide-clipboard-x"
			>
				<rect width="8" height="4" x="8" y="2" rx="1" ry="1"></rect>
				<path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
				<path d="m15 11-6 6"></path>
				<path d="m9 11 6 6"></path>
			</svg>
			Failure!`;

		ctc.append(ctcSuccess, ctcFailure);
		element.append(title, desc, ctc);

		document.body.prepend(element);

		window.addEventListener("mousemove", (event) => {
			const element = document.getElementById("title");
	
			element.style.top = (event.clientY + 20) + "px";
			element.style.left = (event.clientX) + "px";
	
			const title = event.target.closest("[data-title], [data-desc]")?.getAttribute("data-title") || "";
			const desc = event.target.closest("[data-title], [data-desc]")?.getAttribute("data-desc") || "";
	
			if (title || desc) {
				element.style.display = "flex";
				element.querySelector("span.title").innerHTML = title;
				element.querySelector("span.desc").innerHTML = desc;
			} else {
				element.style.display = "none";
				element.querySelector("span.title").innerHTML = "";
				element.querySelector("span.desc").innerHTML = "";
			}
		});
		
		console.timeEnd("Add Title");
	});
};