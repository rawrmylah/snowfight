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
	constructor(id, name, color) {
		super(id, name, color);
	}
}
