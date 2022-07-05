const { io } = require("../index");

const Bands = require("../models/bands");
const Band = require("../models/band");

const bands = new Bands();

bands.addBand(new Band("Metallica"));
bands.addBand(new Band("Iron Maiden"));
bands.addBand(new Band("AC/DC"));
bands.addBand(new Band("Nirvana"));

// io => Soy yo como servidor express.js
// client => Es el flutter que se conecta

// Mensajes de Sockets
io.on("connection", (client) => {
	console.log("Cliente conectado");

	client.emit("active-bands", bands.getBands());

	client.on("disconnect", () => {
		console.log("Cliente desconectado");
	});

	client.on("mensaje", (payload) => {
		console.log(payload);
		io.emit("mensaje", { admin: "Nuevo mensaje" });
	});

	client.on("vote-band", (payload) => {
		bands.voteBand(payload.id);
		io.emit("active-bands", bands.getBands());
	});

	client.on("add-band", (payload) => {
		bands.addBand(new Band(payload.name));
		io.emit("active-bands", bands.getBands());
	});

	client.on("delete-band", (payload) => {
		bands.deleteBand(payload.id);
		io.emit("active-bands", bands.getBands());
	});

	// Cuando escucho al cliente (client.on(...)), yo (io.emit(...)) emito una respuesta
	// client.on("emitir-mensaje", (payload) => {
	// 	// io.emit("nuevo-mensaje", payload); // emite a todos
	// 	client.broadcast.emit("nuevo-mensaje", payload); // emite a todos excepto al que lo envia
	// });
});
