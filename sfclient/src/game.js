import { SelfPlayer } from "./player";
import Player from "./player";
import EventEmitter from "events";

export default class Game extends EventEmitter {
	constructor(server, scene, control) {
		super();
		this.players = {};
		this.server = server;
		this.scene = scene;
		this.selfId = null;
		this.control = control;
		this.#init();
	}
	#init() {
		this.server.on("acknowledge_join", (msg) => {
			this.selfId = msg.id;
		});
		this.server.on("new_player", (msg) => {
			this.#addPlayer(msg.id, msg.name, msg.color);
		});
		this.server.on("leave", (msg) => {
			this.#removePlayer(this.players[msg.id]);
		});
		this.server.on("update_position", (msg) => {
			console.log(msg);
			this.players[msg.author].setPosition(msg.position.x, msg.position.y);
		});
	}
	#addPlayer(id, name, color) {
		const player =
			id === this.selfId
				? new SelfPlayer(id, name, color, this.control, this)
				: new Player(id, name, color);
		this.scene.add(player.visual);
		this.players[id] = player;
	}
	#removePlayer(player) {
		delete this.players[player.id];
	}
	join(name, color) {
		this.server.send({
			event: "join",
			name: name,
			color: color,
		});
	}
	gameTick() {
		this.emit("gameTick");
	}
}
