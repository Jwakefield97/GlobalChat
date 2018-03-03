"use strict"; 
let x,
    y,
    height,
    width,
    socket,
    playerDir = {
        UP: 87,
        DOWN: 83,
        LEFT: 65,
        RIGHT: 68 
    },
    playerSize = 50,
    gunSize = 20, 
    player = {
        id: (new Date()).getTime(), //give unique id (fix this)
        score: 0,
        quad: {
            tlx: 0, //top left x 
            tly: 0, //top left y 
            trx: 0,
            try: 0,
            blx: 0,
            bly: 0,
            brx: 0,  
            bry: 0 
        },
        bullets: [], 
        dir: playerDir.UP
    },
    enemies = {}; //store id as keys 
function setup() {
    console.log(this);
    socket = io(); 
    height = windowHeight-15;
    width = windowWidth-15; 
    x = random(width); 
    y = random(height); 
    createCanvas(width, height);
    socket.on("move",(msg)=>{
        if(msg.id !== player.id){
            enemies[msg.id.toString()] = msg; 
        }
    }); 
    socket.on("shoot",(msg)=>{
        if(msg.id !== player.id){
            enemies[msg.id.toString()] = msg; 
        }
    }); 
}
function draw() {
    let hasMoved = false; 
    if(keyIsDown(playerDir.UP)){ //w   i.e. up 
        y-=4;
        player.dir = playerDir.UP
        hasMoved = true; 
    } 
    if(keyIsDown(playerDir.LEFT)){//a  i.e. left
        x-=4;
        player.dir = playerDir.LEFT
        hasMoved = true;
    } 
    if(keyIsDown(playerDir.DOWN)){//s   i.e. down
        y+=4;
        player.dir = playerDir.DOWN
        hasMoved = true;
    }  
    if(keyIsDown(playerDir.RIGHT)){//d  i.e. right 
        x+=4;
        player.dir = playerDir.RIGHT
        hasMoved = true;
    }

    clear(); //clear canvas
    background(0,0,0); //set background to blue 
    updateBullet(); //update all bullet coords 

    //TODO: put this in its own function
    for(let enem in enemies){
        let e = enemies[enem]; 
        strokeWeight(8);
        stroke(255,0,0); 
        //set the players direction indicator  
        switch(e.dir){
            case playerDir.UP: 
                line(e.quad.tlx,e.quad.tly,e.quad.trx,e.quad.try)
                break; 
            case playerDir.DOWN: 
                line(e.quad.blx,e.quad.bly,e.quad.brx,e.quad.bry)
                break; 
            case playerDir.LEFT: 
                line(e.quad.tlx,e.quad.tly,e.quad.blx,e.quad.bly)
                break; 
            case playerDir.RIGHT: 
                line(e.quad.trx,e.quad.try,e.quad.brx,e.quad.bry) 
                break; 
        }
        strokeWeight(0);
        stroke(0); 
        e.bullets.forEach(bullet=>{
            if(bullet.y >= height || bullet.y <= 0){
                e.bullets = e.bullets.filter(b => b !== bullet);
            }else{
                //update bullet coords based on its direction 
                switch(bullet.dir){
                    case playerDir.UP: 
                        bullet.y -= 10; 
                        break; 
                    case playerDir.DOWN: 
                        bullet.y += 10; 
                        break; 
                    case playerDir.LEFT: 
                        bullet.x -= 10; 
                        break; 
                    case playerDir.RIGHT: 
                        bullet.x += 10; 
                        break; 
                }
            }
            ellipse(bullet.x,bullet.y,10,10);
        }); 
        //player rectangle    coord order == tl,tr,br,bl 
        quad(e.quad.tlx,e.quad.tly,e.quad.trx,e.quad.try,e.quad.brx,e.quad.bry,e.quad.blx,e.quad.bly);
    }

    //update player coords 
    player.quad.tlx = x; 
    player.quad.tly = y;
    player.quad.trx = x+playerSize; 
    player.quad.try = y;
    player.quad.brx = x+playerSize; 
    player.quad.bry = y+playerSize;
    player.quad.blx = x; 
    player.quad.bly = y+playerSize;
    if(hasMoved){
        socket.emit("move", player);
    }

    strokeWeight(8);
    stroke(0,0,255); 
    //set the players direction indicator  
    switch(player.dir){
        case playerDir.UP: 
            line(player.quad.tlx,player.quad.tly,player.quad.trx,player.quad.try)
            break; 
        case playerDir.DOWN: 
            line(player.quad.blx,player.quad.bly,player.quad.brx,player.quad.bry)
            break; 
        case playerDir.LEFT: 
            line(player.quad.tlx,player.quad.tly,player.quad.blx,player.quad.bly)
            break; 
        case playerDir.RIGHT: 
            line(player.quad.trx,player.quad.try,player.quad.brx,player.quad.bry) 
            break; 
    }
    strokeWeight(0);
    stroke(0); 
    //player rectangle    coord order == tl,tr,br,bl 
    quad(player.quad.tlx,player.quad.tly,player.quad.trx,player.quad.try,player.quad.brx,player.quad.bry,player.quad.blx,player.quad.bly);
    hasMoved = false; 
}
function shoot(){
    let xCord,yCord; 
    switch(player.dir){
        case playerDir.UP: 
            xCord = player.quad.tlx+(playerSize/2);
            yCord = player.quad.tly; 
            break; 
        case playerDir.DOWN: 
            xCord = player.quad.blx+(playerSize/2);
            yCord = player.quad.bry; 
            break; 
        case playerDir.LEFT: 
            xCord = player.quad.tlx;
            yCord = player.quad.bly-(playerSize/2); 
            break; 
        case playerDir.RIGHT: 
             xCord = player.quad.trx;
             yCord = player.quad.bry-(playerSize/2); 
            break; 
    }
    player.bullets.push({x: xCord, y: yCord,dir: player.dir});
    socket.emit("shoot", player);
}

function keyPressed(){
    if(keyCode === 32){//spacebar 
        shoot();
    }
}

function updateBullet(){
    player.bullets.forEach(item =>{
        if(item.y >= height || item.y <= 0){
            player.bullets = player.bullets.filter(e => e !== item);
        }else{
            //update bullet coords based on its direction 
            switch(item.dir){
                case playerDir.UP: 
                    item.y -= 10; 
                    break; 
                case playerDir.DOWN: 
                    item.y += 10; 
                    break; 
                case playerDir.LEFT: 
                    item.x -= 10; 
                    break; 
                case playerDir.RIGHT: 
                    item.x += 10; 
                    break; 
            }
        }
        ellipse(item.x,item.y,10,10);
    });
}