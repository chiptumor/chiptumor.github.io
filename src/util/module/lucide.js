import { createIcons, icons } from "lucide";

document.addEventListener("DOMContentLoaded", () => createIcons({ icons }));
new MutationObserver(() => createIcons({ icons }));
