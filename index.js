"use strict"; 
let express = require("express")(),
    socketIo = require("socket.io"); 
express.use(express.static("resources"));

app.set("view engine","pug");//sets view engine  
app.set("views", "./views");  //tells view engine where to look for templates 





express.listen(3000,()=>{
    console.log("Listening on port 3000")
}); 