export default function (object) {
    document.querySelectorAll("replace").forEach(element => {
        const regex = /\s*([\w.]+)\s*/;
        const item =
            element.textContent.replace(regex, (_, path) =>
                path.split(".").reduce((obj, key) => obj?.[key], object)
            );
        element.replaceWith(item ?? element);
    });

    document.querySelectorAll("[data-replace-attr]").forEach(element => {
        const regex = /\s+/g;
        element.getAttribute("data-replace-attr").split(regex).forEach(attr => {
            const item =
                element.getAttribute(attr)
                .split(".").reduce((obj, key) => obj?.[key], object);
            element.setAttribute(attr, item ?? "undefined");
        });
        element.removeAttribute("data-replace-attr");
    });
}
