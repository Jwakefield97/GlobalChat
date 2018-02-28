"use strict";
let socket = io(),
    username = "jake",
    messageBox = document.getElementById("message-box");
    
document.getElementById("submit-button").addEventListener("click", (evt)=>{
    socket.emit("message",{username: username, msg: messageBox.value})
    messageBox.value = ""; 
});

//listen for enter key when in text box
messageBox.addEventListener("keypress", (e)=>{
    let key = e.which || e.keyCode;
    if (key === 13) { // 13 is enter
        socket.emit("message",{username: username, msg: messageBox.value})
        messageBox.value = ""; 
    }
}); 

socket.on("message",(msg)=>{
    let messageWrapper = document.getElementById("message-wrapper"),
        divNode = document.createElement("div"),
        senderSpanNode = document.createElement("span"),  
        pNode = document.createElement("p"),
        spanNode = document.createElement("span"),
        now = new Date(); 

        divNode.classList.add("container"); 
        if(msg.username === username){
            divNode.classList.add("darker")
            senderSpanNode.innerText = "Me"; 
        }else{
            senderSpanNode.innerText = msg.username; 
        }
        pNode.innerText = msg.msg; 

        spanNode.innerText = now.getHours()+":"+now.getMinutes(); 
        spanNode.classList.add("time-right"); 

        divNode.appendChild(senderSpanNode);
        divNode.appendChild(pNode); 
        divNode.appendChild(spanNode); 

        messageWrapper.appendChild(divNode); 
});