const express = require("express");
const path = require("path");

const chatapp = express();
const server = require("http").createServer(chatapp);

const io = require("socket.io")(server);

chatapp.use(express.static(path.join(__dirname+"/public")));

io.on("connection", function(socket){
	socket.on("newmember", function(username){
		socket.broadcast.emit("update", username + " has entered the chat");
	});

	socket.on("dropmember", function(username){
		socket.broadcast.emit("update", username + " has left the chat");
	});

	socket.on("chat", function(msg){
		socket.broadcast.emit("chat", msg);
	});
});



server.listen(5000);


