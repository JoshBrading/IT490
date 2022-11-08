const express = require("express");
const path = require("path");

const chatapp = express();
const server = require("http").createServer(chatapp);

const io = require("socket.io")(server);

chatapp.use(express.static(path.join(__dirname+"/public")));

io.on("connection", function(socket){
	//User join chat
	socket.on("newmember", function(username){
		socket.broadcast.emit("update", username + " has entered the chat");
	});
	
	//User leave chat
	socket.on("dropmember", function(username){
		socket.broadcast.emit("update", username + " has left the chat");
	});

	//User display message
	socket.on("chat", function(msg){
		socket.broadcast.emit("chat", msg);
	});
});



server.listen(5000);

/*
Creating a Chat App .
Source: Create Real-time Chat App using HTML, CSS, JavaScript, NodeJS & Socket.io
Source Code: https://www.youtube.com/watch?v=kOJEWNPYBUo 
Author: Codingflag
retrive on 10/2/2022
*/
