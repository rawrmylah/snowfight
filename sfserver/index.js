import express from "express";
const app = express();
import expressWs from "express-ws";
import "dotenv/config";
expressWs(app);
import Game from "./src/game.js";

const game = new Game();

app.ws("/ws", (ws, req) => {
	game.waitJoin(ws);
});

app.listen(process.env.PORT, null, () => {
	console.log(`Server started at localhost:${process.env.PORT}`);
});
