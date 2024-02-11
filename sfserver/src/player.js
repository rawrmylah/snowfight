export default class Player {
	constructor(ws, playerId) {
		this.ws = ws;
		this.id = playerId;
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
