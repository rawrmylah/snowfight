import { SelfPlayer } from "./player";
import Player from "./player";
import EventEmitter from "events";
import Snowball from "./snowball";

export default class Game extends EventEmitter {
	constructor(server, scene, control) {
		super();
		this.players = {};
		this.snowballs = {};
		this.selfId = null;
		this.server = server;
		this.scene = scene;
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
			this.players[msg.author].setRotation(msg.rotation.yaw);
		});
		this.server.on("snowball", (msg) => {
			if (this.snowballs[msg.id]) {
				this.snowballs[msg.id].setPosition(msg.position);
				this.snowballs[msg.id].setVelocity(msg.velocity);
			} else {
				this.snowballs[msg.id] = new Snowball(
					msg.position,
					msg.velocity,
					msg.author,
					msg.id,
					this
				);
				this.scene.add(this.snowballs[msg.id].visual);
			}
		});
		this.server.on("destroy_snowball", (msg) => {
			if (!this.snowballs[msg.id]) return;
			this.snowballs[msg.id].destroy();
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
	gameTick(timeDt) {
		this.emit("gameTick", timeDt);
	}
	throwSnowball(power, directionAngle, elevationAngle) {
		power = Math.min(1, power + 0.5);
		const powerFactor = 30;
		const velocity = {
			x:
				powerFactor *
				power *
				Math.cos(directionAngle) *
				Math.cos(elevationAngle),
			y:
				powerFactor *
				power *
				Math.sin(directionAngle) *
				Math.cos(elevationAngle),
			z: powerFactor * power * Math.sin(elevationAngle),
		};
		this.server.send({
			event: "snowball",
			position: {
				x: this.players[this.selfId].visual.position.x,
				y: this.players[this.selfId].visual.position.y,
				z:
					this.players[this.selfId].visual.position.z +
					this.players[this.selfId].visual.geometry.parameters.height / 2,
			},
			velocity,
		});
	}
}
