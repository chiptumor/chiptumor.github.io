import removeSrc from "./plugin/remove-src.js";
import replaceTemplates from "./plugin/replace-templates.js";

import lucidePreprocess from "vite-plugin-lucide-preprocess";

const plugins = [
    removeSrc(),
    replaceTemplates(),

    lucidePreprocess()
];

export default plugins;