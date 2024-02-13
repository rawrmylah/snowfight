export default class Player {
	constructor(ws, playerId, name, color) {
		this.ws = ws;
		this.id = playerId;
		this.name = name;
		this.color = color;
	}

	send(obj) {
		var msg = JSON.stringify(obj);
		this.ws.send(msg);
	}

	onReceive(callback) {
		this.ws.on("message", (msg) => {
			var obj = JSON.parse(msg);
			callback(obj);
		});
	}

	onDisconnect(callback) {
		this.ws.on("close", callback);
	}
}
