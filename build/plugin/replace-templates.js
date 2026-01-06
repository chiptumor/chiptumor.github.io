const plugin = ({ template }) => ({
    name: "replace-templates",
    async transformIndexHtml(html) {
        const regex = /\{\{\s*([\w.]+)\s*\}\}/g;
        const promises = [];
        html.replace(regex, (match, path) => promises.push(
            path.split(".").reduce(
                (obj, key) =>
                    Promise.resolve(obj)
                    .then(obj => obj?.[key]),
                template
            )
            .then(value => value ?? match)
        ));
        const data = await Promise.all(promises);
        return html.replace(regex, () => data.shift());
        // TODO: convert client templates to elements
    }
    // thank you overcl9ck
    // https://stackoverflow.com/a/48032528/31616199
});

export default plugin;
