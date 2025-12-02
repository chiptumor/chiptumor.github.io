import "./util/module/lucide.js";

//#region banner
addEventListener("load", async () => {
    
});

//#region greeting
addEventListener("load", async () => {
    
});

//#region status
addEventListener("load", async () => {
    
});

//#region todo list
addEventListener("load", async () => {
    const url = "https://api.github.com/repos/chiptumor/chiptumor.github.io/contents/todo.md";
    const headers = {
        "Accept": "application/vnd.github.html+json"
        // https://docs.github.com/en/rest/repos/contents?apiVersion=2022-11-28#get-repository-content
    };
    
    const text = await fetch(url, { headers })
        .then(response => response.text());
});
