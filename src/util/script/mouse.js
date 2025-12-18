const element = document.createElement("div");
    element.setAttribute("id", "tooltip");

const titleEl = document.createElement("span");
    titleEl.classList.add("title");
const descEl = document.createElement("span");
    descEl.classList.add("desc");
const clipboard = document.createElement("span");
    clipboard.classList.add("clip");
    clipboard.innerHTML = "Copied!";
    
element.append(titleEl, descEl, clipboard);
document.body.prepend(element);

window.addEventListener("mousemove", event => {
    element.style.top = (event.clientY + 20) + "px";
    element.style.left = (event.clientX) + "px";
    
    const hovered = event.target.closest("[data-title], [data-desc]");
    const title = hovered?.getAttribute("data-title");
    const desc = hovered?.getAttribute("data-desc");

    if (title || desc) {
        element.style.display = "flex";
        titleEl.innerHTML = title;
        descEl.innerHTML = desc;
    } else {
        element.style.display = "none";
        titleEl.innerHTML = "";
        descEl.innerHTML = "";
    }
});

window.addEventListener("click", event => {
    const clip = event.target.closest("[data-copy]");
    if (clip) {
        navigator.clipboard.writeText(clip.getAttribute("data-copy"));
        element.classList.add("copied");
    }

    setTimeout(() => element.classList.remove("copied"), 1500);
});
