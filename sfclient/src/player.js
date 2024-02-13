import * as THREE from "three";

export default class Player {
	constructor(id, name, color) {
		this.id = id;
		this.name = name;
		this.color = color;

		this.geometry = new THREE.BoxGeometry(1, 1, 1);
		this.material = new THREE.MeshBasicMaterial({ color: this.color });
		this.visual = new THREE.Mesh(this.geometry, this.material);
	}
	setPosition(x, y) {
		this.visual.position.x = x;
		this.visual.position.y = y;
	}
}

export class SelfPlayer extends Player {
	constructor(id, name, color, control, game) {
		super(id, name, color);
		this.control = control;
		this.game = game;

		this.#init();
	}
	#init() {
		this.game.on("gameTick", () => {
			const moveX = this.control.getMoveX() * 0.1;
			const moveY = this.control.getMoveY() * 0.1;
			this.visual.position.x += moveX;
			this.visual.position.y += moveY;
			if (moveX || moveY) {
				this.game.server.send({
					event: "update_position",
					position: {
						x: this.visual.position.x,
						y: this.visual.position.y,
					},
				});
			}
		});
	}
}
