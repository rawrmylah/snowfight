import Player from "./player.js";

export default class Game {
	constructor() {
		this.players = {};
		this.playerMaxId = 0;
		this.snowballMaxId = 0;
		this.snowballs = {};
	}

	sendToAll(msg, filter = () => true) {
		// filter is a function that takes a player and returns true if the message should be sent to that player
		for (var key in this.players) {
			if (!filter(this.players[key])) continue;
			this.players[key].send(msg);
		}
	}

	waitJoin(ws) {
		console.log("waiting for join message");
		ws.once("message", (msg) => {
			var obj = JSON.parse(msg);
			if (obj.event == "join") this.addPlayer(ws, obj.name, obj.color);
		});
	}

	addPlayer(ws, name, color) {
		const player = new Player(ws, this.playerMaxId++, name, color);
		console.log("adding player " + name + " with id " + player.id);
		this.players[player.id] = player;

		player.send({
			event: "acknowledge_join",
			id: player.id,
		});

		for (var key in this.players) {
			player.send({
				event: "new_player",
				id: this.players[key].id,
				name: this.players[key].name,
				color: this.players[key].color,
			});
		}

		this.sendToAll(
			{
				event: "new_player",
				id: player.id,
				name: player.name,
				color: player.color,
			},
			(p) => p.id != player.id
		);

		player.onReceive((msg) => {
			msg.author = player.id;
			console.log("received message from player " + player.id, msg);
			if ([].includes(msg.event)) {
				this.sendToAll(msg);
			} else if (msg.event === "snowball") {
				msg.snowballId = this.snowballMaxId++;
				this.snowballs[msg.snowballId] = msg;
				this.sendToAll(msg);
			} else {
				this.sendToAll(msg, (p) => p.id != player.id);
			}
		});

		player.onDisconnect((req) => {
			console.log("leaving player " + player.id);
			delete this.players[player.id];

			// send leave message to all other players
			this.sendToAll({
				action: "leave",
				author: player.id,
			});
		});

		return player;
	}
}
