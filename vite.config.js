import { defineConfig } from "vite";
import { JSDOM } from "jsdom";

export default defineConfig({
    plugins: [
        {
            name: "",
            async transformIndexHtml(html) {
                const document = new JSDOM(html);
            }
        }
    ],
    build: {
        rollupOptions: {
            input: {
                main: "src/index.html"
            }
        }
    }
})