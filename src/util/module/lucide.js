import { createIcons, ChevronDown, ChevronUp } from "lucide";

const create = () => createIcons({ icons: {
    ChevronDown,
    ChevronUp
}});

create();
new MutationObserver(create);
