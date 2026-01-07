import express from "express";

const app = express();
app.use("/", express.static("./dist"));
app.listen(5500, () => console.log("Server running at http://127.0.0.1:5500/"));
