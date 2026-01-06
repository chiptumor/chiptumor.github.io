const plugin = () => ({
    name: "remove-src-dir-from-path",
    enforce: "post",
    generateBundle(_, bundle) {
        const regex = /^src\//;
        for (const item of Object.values(bundle)) {
            if (!regex.test(item.fileName)) continue;
            item.fileName = item.fileName.replace(regex, "");
        }
    }
});

export default plugin;
