import * as THREE from "three";

export default class Snowball {
	constructor(pos, velocity, owner, id, game) {
		this.velocity = velocity;
		this.owner = owner;
		this.game = game;
		this.id = id;

		this.size = 0.3;

		this.geometry = new THREE.SphereGeometry(this.size, 32, 32);
		this.material = new THREE.MeshPhongMaterial({ color: 0xffffff });
		this.visual = new THREE.Mesh(this.geometry, this.material);

		this.visual.castShadow = true;

		this.setPosition(pos);

		this.handler = this.#tick.bind(this);
		this.game.on("gameTick", this.handler);
	}
	#tick(timeDt) {
		this.visual.position.x += this.velocity.x * timeDt;
		this.visual.position.y += this.velocity.y * timeDt;
		this.visual.position.z += this.velocity.z * timeDt;
		this.velocity.z -= 5 * timeDt;
		if (this.visual.position.z < 0) {
			this.destroy();
		}

		//check for collision with players
		if (
			this.game.players[this.game.selfId].checkCollision(this) &&
			this.owner !== this.game.selfId
		) {
			this.game.server.send({
				event: "hit_player",
				id: this.owner,
				target: this.game.selfId,
			});
			this.destroy(true);
		}
	}
	setPosition(pos) {
		this.visual.position.x = pos.x;
		this.visual.position.y = pos.y;
	}
	setVelocity(velocity) {
		this.velocity = velocity;
	}
	destroy(selfEmmit = false) {
		this.game.off("gameTick", this.handler);
		this.game.scene.remove(this.visual);
		if (selfEmmit) {
			this.game.server.send({
				event: "destroy_snowball",
				id: this.id,
			});
		}
		delete this.game.snowballs[this.id];
	}
}
