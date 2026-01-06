import template from "./template.js";

import removeSrc from "./plugin/remove-src.js";
import replaceTemplates from "./plugin/replace-templates.js";

import lucidePreprocess from "vite-plugin-lucide-preprocess";

const plugins = [
    removeSrc(),
    replaceTemplates({ template }),

    lucidePreprocess()
];

export default plugins;