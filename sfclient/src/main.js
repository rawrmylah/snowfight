import "./style.css";

import * as THREE from "three";
import Server from "./server";
import Game from "./game";
import Scene from "./scene";
import Control from "./control";

const control = new Control();
const scene = new Scene();
const server = new Server();
const game = new Game(server, scene, control);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

document.getElementById("joinButton").addEventListener("click", () => {
	const name = document.getElementById("playerName").value;
	const color = document.getElementById("playerColor").value;
	document.getElementById("menu").style.display = "none";

	game.join(name, color);
});

let lastTime = new Date().getTime();
function animate() {
	requestAnimationFrame(animate);

	const currentTime = new Date().getTime();
	const dt = currentTime - lastTime;
	lastTime = currentTime;
	game.gameTick(dt / 1000);

	renderer.render(scene, scene.camera);
}

animate();
