import * as THREE from "three";

export default class Scene extends THREE.Scene {
	constructor() {
		super();
		this.camera = new THREE.PerspectiveCamera(
			75,
			window.innerWidth / window.innerHeight,
			0.1,
			1000
		);
		this.camera.isometric = true;
		this.camera.position.z = 25;
	}
}
