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
			if (event.repeat) return;
			const key = event.key.toLowerCase();
			if (!keyMap[key]) return;

			this.currentlyPressedKeys[keyMap[key]] = new Date().getTime();
			if (keyMap[key] === "throw") return;
			this.emit(keyMap[key]);
		});
		document.addEventListener("keyup", (event) => {
			const key = event.key.toLowerCase();
			if (!keyMap[key]) return;

			if (keyMap[key] === "throw") {
				this.emit(
					"throw",
					getSpeed(new Date().getTime() - this.currentlyPressedKeys["throw"])
				);
			}

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

function getSpeed(timeDt) {
	return Math.min(0.5, timeDt / 3000 + 0.1);
}
