"use strict"; 
const express = require("express"), 
    app = express(), 
    http = require("http").Server(app),
    socketIo = require("socket.io")(http); 
app.use(express.static("resources"));

app.set("view engine","pug");//sets view engine  
app.set("views", "./views");  //tells view engine where to look for templates 

app.get("/",(req,res)=>{
    res.render("index.pug"); 
}); 

socketIo.on("connection",(socket)=>{
    console.log("user connected"); 
    socket.on("message",(msg)=>{
        console.log(msg); 
        socketIo.emit("message",msg); 
    });
});


http.listen(3000,()=>{
    console.log("Listening on port 3000");
}); 