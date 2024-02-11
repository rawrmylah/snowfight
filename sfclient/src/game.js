import Player from "./player";

export default class Game {
	constructor(server, scene) {
		this.players = {};
		this.server = server;
		this.scene = scene;
		this.#init();
	}
	#init() {
		this.server.on("self_join", (msg) => {
			this.#addPlayer(msg.id, msg.name, msg.color);
			msg.others.forEach((id) => {
				this.#addPlayer(id, msg.name, msg.color);
			});
		});
		this.server.on("new_player", (msg) => {
			this.#addPlayer(msg.id, msg.name, msg.color);
		});
		this.server.on("leave", (msg) => {
			this.#removePlayer(this.players[msg.id]);
		});
		this.server.on("update_position", (msg) => {
			this.players[msg.id].position = msg.position;
		});
	}
	#addPlayer(id, name, color) {
		const player = new Player(id, name, color);
		this.players[player.id] = player;
		this.scene.add(player.visual);
	}
	#removePlayer(player) {
		delete this.players[player.id];
	}
}
