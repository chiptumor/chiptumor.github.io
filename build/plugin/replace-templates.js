const plugin = ({ template }) => ({
    name: "replace-templates",
    transformIndexHtml(html) {
        const regex = /\{\{\s*([\w.]+)\s*\}\}/g;
        return html.replace(regex, (match, path) => {
            const value = path.split(".").reduce((obj, key) => obj?.[key], template);
            return value ?? match;
            // TODO: convert client templates to elements
        });
    }
});

export default plugin;
