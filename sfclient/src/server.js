import EventEmitter from "events";
const serverPath = "ws://localhost:8888/ws";

export default class Server extends EventEmitter {
	constructor() {
		super();
		this.ws = new WebSocket(serverPath);
		this.#init();
	}
	#init() {
		this.ws.onopen = () => {
			console.log("connected to server");
		};
		this.ws.onmessage = (event) => {
			const message = JSON.parse(event.data);
			console.log("received message from server", message);
			this.emit(message.event, message);
		};
		this.ws.onclose = () => {
			console.log("disconnected from server");
			this.emit("disconnect");
		};
	}
	send(data) {
		this.ws.send(
			JSON.stringify({
				...data,
				author: this.id,
			})
		);
	}
}
