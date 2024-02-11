import "./style.css";

import * as THREE from "three";
import Server from "./server";
import Game from "./game";
import Scene from "./scene";
import Player from "./player";

const scene = new Scene();
const server = new Server();
const game = new Game(server, scene);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// const testPlayer = new Player(0, "test", 0x00ff00);
// scene.add(testPlayer.visual);

function animate() {
	requestAnimationFrame(animate);

	renderer.render(scene, scene.camera);
}

animate();
