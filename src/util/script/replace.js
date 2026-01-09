export function replace(object) {
    document.querySelectorAll("replace[with]").forEach(element => {
        const onfail = element.getElementsByTagName("fail")[0] ?? element;
        const regex = /\s*([\w.]+)\s*/;
        const item = element
            .getAttribute("with").split(".")
            .reduce((obj, key) => obj?.[key], object);
        element.replaceWith(item ?? onfail);
    });

    document.querySelectorAll("[rep-attr]").forEach(element => {
        const regex = /(?<=^rep:).+/;
        Array.from(element.attributes).forEach(attr => {
            const name = attr.name.match(regex)[0];
            if (name) {
                const replace =
                    attr.value.split(".")
                    .reduce((obj, key) => obj?.[key], object);
                element.setAttribute(name, replace);
                element.removeAttribute(attr.name);
                element.removeAttribute("hide");
            }
        });

        element.getAttribute("rep-attr").split(regex).forEach(attr => {
            const item =
                element.getAttribute(attr)
                .split(".").reduce((obj, key) => obj?.[key], object);
            element.setAttribute(attr, item ?? "undefined");
        });
        element.removeAttribute("rep-attr");
        element.removeAttribute("hide");
    });
}

export function reduce(object) {
}
