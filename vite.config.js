import { defineConfig } from "vite";
import { glob } from "glob";

import plugins from "./build/plugins.js";

const viteConfig = defineConfig({
    preview: {
        port: 6767
    },
    build: {
        emptyOutDir: true,
        assetsInlineLimit: 0,
        sourcemap: true,
        rollupOptions: {
            input: [
                ...glob.sync("src/**/*.html")
            ]
        }
    },
    css: {
        devSourcemap: true
    },
    plugins
});

export default viteConfig;
