const plugin = ({ template }) => ({
    name: "replace-templates",
    transformIndexHtml(html) {
        const regex = /\{\{\s*([\w.]+)\s*\}\}/g;
        return html.replace(regex, (match, path) => {
            const value = path.split(".")
                .reduce((obj, key) =>
                    Promise.resolve(obj)
                    .then(obj => obj?.[key]),
                template
            )
            .then(value => value ?? match);
            // TODO: convert client templates to elements
        });
    }
});

export default plugin;
