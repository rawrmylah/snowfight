import EventEmitter from "events";

const keyMap = {
	w: "up",
	a: "left",
	s: "down",
	d: "right",
	" ": "jump",
	arrowleft: "throw",
};

export default class Control extends EventEmitter {
	constructor() {
		super();
		this.currentlyPressedKeys = {};
		document.addEventListener("keydown", (event) => {
			const key = event.key.toLowerCase();
			console.log(key);
			if (!keyMap[key]) return;

			this.currentlyPressedKeys[keyMap[key]] = true;
			this.emit(keyMap[key]);
		});
		document.addEventListener("keyup", (event) => {
			const key = event.key.toLowerCase();
			if (!keyMap[key]) return;

			this.currentlyPressedKeys[keyMap[key]] = false;
			this.emit("keyUp", keyMap[key]);
		});
	}
	getMoveX() {
		return (
			(this.currentlyPressedKeys["left"] ? -1 : 0) +
			(this.currentlyPressedKeys["right"] ? 1 : 0)
		);
	}
	getMoveY() {
		return (
			(this.currentlyPressedKeys["up"] ? 1 : 0) +
			(this.currentlyPressedKeys["down"] ? -1 : 0)
		);
	}
}
