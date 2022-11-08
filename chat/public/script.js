(function (){
	
	const chatapp = document.querySelector(".chatapp");
	const socket = io();

	let member;

	chatapp.querySelector(".join-screen #join-user").addEventListener("click", function(){
		
		let user = chatapp.querySelector(".join-screen #username").value;
		
		//ERROR MSG IF USERNAME NOT ENTERED
		if(user.length == 0){
			return alert("Enter username");
		}

		socket.emit("newmember", user);
		member = user;
		chatapp.querySelector(".join-screen").classList.remove("active");
		chatapp.querySelector(".chat-screen").classList.add("active");
	});

	chatapp.querySelector(".chat-screen #send-msg").addEventListener("click", function(){

		let msg = chatapp.querySelector(".chat-screen #msg-enter").value;
		
		if (msg.length == 0){
			return;
		}
		
		//DISPLAY USER NAME
		renderMessage("my", {
			user : member,
			text : msg
		});
		
		//DISPLAY USER MESSAGE
		socket.emit("chat", {
			user : member,
			text : msg 
		});

		chatapp.querySelector(".chat-screen #msg-enter").value = "";
	});
	
	//RETURN TO HOME(USER JOIN SCREEN)
	chatapp.querySelector(".chat-screen #exit-room").addEventListener("click", function(){
		socket.emit("dropmember", member);
		window.location.href = window.location.href;
	});

	socket.on("update", function(update){
		renderMessage("update", update);
	});


	socket.on("chat", function(msg){
		renderMessage("other", msg);
	});

	function renderMessage(type, msg){
		
		let msgview = chatapp.querySelector(".chat-screen .msgs");
		
		//USER MESSAGE
		if(type == "my"){
			
			let tag = document.createElement("div");
			
			tag.setAttribute("class", "msg my-msg");

			tag.innerHTML = `
				<div>
					<div class="user-name">You</div>
                    <div class="text">${msg.text}</div>
				</div>
			`;
			msgview.appendChild(tag);
		}
		
		//ADDITION USER MESSAGE
		else if (type == "other"){
			
			let tag = document.createElement("div");
			
			tag.setAttribute("class", "msg other-msg");
			
			tag.innerHTML = `
				<div>
					<div class="user-name">${msg.user}</div>
                    <div class="text">${msg.text}</div>
				</div>
			`;
			msgview.appendChild(tag);
		}
		
		//UPDATE CHAT JOIN/LEAVE MESAGE
		else if (type == "update"){
			
			let tag = document.createElement("div");
			
			tag.setAttribute("class", "update");
			
			tag.innerText = msg;

			msgview.appendChild(tag);
		}
		
		/*CREATE MEMBER LIST*/

		//scroll chat windows to view messages
		msgview.scrollTop = msgview.scrollHeight - msgview.clientHeight;
	}

})();

/*
Creating a Chat App .
Source: Create Real-time Chat App using HTML, CSS, JavaScript, NodeJS & Socket.io
Source Code: https://www.youtube.com/watch?v=kOJEWNPYBUo 
Author: Codingflag
retrive on 10/2/.2022
*/

