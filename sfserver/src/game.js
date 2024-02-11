import Player from "./player.js";

export default class Game {
	constructor() {
		this.players = {};
		this.playerMaxId = 0;
	}

	sendToAll(msg, filter = () => true) {
		// filter is a function that takes a player and returns true if the message should be sent to that player
		for (var key in this.players) {
			if (!filter(this.players[key])) continue;
			this.players[key].send(msg);
		}
	}

	addPlayer(ws) {
		const player = new Player(ws, this.playerMaxId++);
		this.players[player.id] = player;

		player.send({
			event: "self_join",
			id: player.id,
			name: "player" + player.id,
			color: 0xff0000,
			others: Object.keys(this.players),
		});

		sendToAll(
			{
				event: "new_player",
				id: player.id,
			},
			(p) => p.id != player.id
		);

		// distribute incoming messages to all other players
		player.onReceive((msg) => {
			console.log("received message from player " + player.id, msg);
			game.sendToAll(msg, (p) => p.id != player.id);
		});

		player.onDisconnect((req) => {
			console.log("leaving player " + player.id);
			delete this.players[player.id];

			// send leave message to all other players
			sendToAll({
				action: "leave",
				id: player.id,
			});
		});

		return player;
	}
}
