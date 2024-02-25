import * as THREE from "three";

export default class Player {
	constructor(id, name, color) {
		this.id = id;
		this.name = name;
		this.color = color;
		this.yaw = 0;

		this.geometry = new THREE.BoxGeometry(0.5, 2, 1);
		this.geometry.rotateX(Math.PI / 2);
		this.material = new THREE.MeshPhongMaterial({ color: this.color });
		this.visual = new THREE.Mesh(this.geometry, this.material);
		this.visual.castShadow = true;
	}
	setPosition(x, y) {
		this.visual.position.x = x;
		this.visual.position.y = y;
	}
	setRotation(yaw) {
		//normalize yaw
		while (yaw > Math.PI) yaw -= 2 * Math.PI;
		while (yaw < -Math.PI) yaw += 2 * Math.PI;
		this.yaw = yaw;
		this.visual.rotation.z = this.yaw;
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
			this.setPosition(
				this.visual.position.x + moveX,
				this.visual.position.y + moveY
			);
			if (moveX || moveY) {
				const moveAngle = Math.atan2(moveY, moveX);
				var deltaAngle = moveAngle - this.yaw;
				if (deltaAngle > Math.PI) deltaAngle -= 2 * Math.PI;
				if (deltaAngle < -Math.PI) deltaAngle += 2 * Math.PI;
				this.setRotation(deltaAngle / 4 + this.yaw);
				this.game.server.send({
					event: "update_position",
					position: {
						x: this.visual.position.x,
						y: this.visual.position.y,
					},
				});
			}
		});
		this.control.on("throw", (power) => {
			this.game.throwSnowball(power, this.yaw, (16 / 180) * Math.PI);
		});
	}
}
