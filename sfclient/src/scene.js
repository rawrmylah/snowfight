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

		const light = new THREE.AmbientLight(0x404040, 0.7); // soft white light
		this.add(light);

		const light2 = new THREE.DirectionalLight(0xf0f0f0, 1.5);
		light2.position.set(5, 5, 10);
		light2.castShadow = true; // enable shadow casting for the directional light
		light2.shadow.mapSize.width = 2048; // default
		light2.shadow.mapSize.height = 2048; // default
		light2.shadow.camera.near = 0.5; // default
		light2.shadow.camera.far = 50; // default
		light2.shadow.camera.left = -30;
		light2.shadow.camera.right = 30;
		light2.shadow.camera.top = 30;
		light2.shadow.camera.bottom = -30;
		this.add(light2);

		this.add(new THREE.CameraHelper(light2.shadow.camera));

		this.traverse(function (object) {
			if (object.isMesh) {
				object.castShadow = true;
				object.receiveShadow = true;
			}
		});

		//add a pink plane as a background
		const geometry = new THREE.PlaneGeometry(100, 100);
		const material = new THREE.MeshPhongMaterial({ color: 0xffffff });
		const plane = new THREE.Mesh(geometry, material);
		// plane.rotateX(Math.PI / 2);
		plane.position.z = 0;
		plane.receiveShadow = true;
		this.add(plane);
	}
}
