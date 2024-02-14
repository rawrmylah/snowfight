import * as THREE from "three";

export default class Snowball {
	constructor(pos, velocity, owner, id, game) {
		this.velocity = velocity;
		this.owner = owner;
		this.game = game;
		this.id = id;

		this.geometry = new THREE.SphereGeometry(1, 32, 32);
		this.material = new THREE.MeshBasicMaterial({ color: 0xffffff });
		this.visual = new THREE.Mesh(this.geometry, this.material);

		this.handler = this.#tick.bind(this);
		this.game.on("gameTick", this.handler);
	}
	#tick() {
		this.visual.position.x += this.velocity.x;
		this.visual.position.y += this.velocity.y;
		this.visual.position.z += this.velocity.z;
		this.velocity.z -= 0.01;
		if (this.visual.position.z < 0) {
			this.game.destroySnowball(this);
		}
	}
	setPosition(pos) {
		this.visual.position.x = pos.x;
		this.visual.position.y = pos.y;
	}
	setVelocity(velocity) {
		this.velocity = velocity;
	}
	destroy() {
		console.log(this.handler);
		this.game.off("gameTick", this.handler);
	}
}