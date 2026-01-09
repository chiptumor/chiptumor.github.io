export function replace(object) {
    document.querySelectorAll("replace[with]").forEach(element => {
        const onfail = element.getElementsByTagName("fail")[0] ?? element;
        element.getAttribute("with").split(".")
            .reduce((obj, key) =>
                Promise.resolve(obj)
                .then(obj => obj?.[key]),
            object)
            .then(item => element.replaceWith(item ?? onfail));
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
    });
}

export function reduce(object) {
}
