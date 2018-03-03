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
    bulletSize = 10, 
    player = {
        id: (new Date()).getTime().toString(), //give unique id (fix this)
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
    enemies = {},//store id as keys
    dead = false,
    playersKilled = [],
    hasMoved = false; 
function setup() {
    socket = io(); 
    height = windowHeight-15;
    width = windowWidth-15; 
    x = random(width); 
    y = random(height); 
    createCanvas(width, height);
    socket.on("move",(msg)=>{
        if(msg.id !== player.id){
            enemies[+msg.id] = msg; 
        }
    }); 
    socket.on("shoot",(msg)=>{
        if(msg.id !== player.id){
            enemies[+msg.id] = msg; 
        }
    }); 
    socket.on("killed",(msg)=>{
        if(msg.id !== player.id){
            enemies[+msg.id] = "deleted"; 
            console.log(enemies);
        }
    }); 
}
function draw() {
    if(!dead){ 
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
            let e = enemies[+enem]; 
            if(e !== "deleted"){
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
                    let collided = collideRectCircle(player.quad.tlx,player.quad.tly,playerSize,playerSize,bullet.x,bullet.y,bulletSize,bulletSize); 
                    if(collided){
                        dead = true;
                        socket.emit("killed", player);
                    }else{
                        ellipse(bullet.x,bullet.y,bulletSize,bulletSize);
                    }
                }); 
                //player rectangle    coord order == tlx/y,trx/y,brx/y,blx/y 
                quad(e.quad.tlx,e.quad.tly,e.quad.trx,e.quad.try,e.quad.brx,e.quad.bry,e.quad.blx,e.quad.bly);
            }
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
    }else{  //player has died 
        textSize(50);
        text("YOU DIED!",width/3,height/3);
        fill(255,0,0);
        hasMoved = false; 
    }
}

function shoot(){
    let xCord,yCord; 
    if(!dead){
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
}

function keyPressed(){
    if(keyCode === 32){//spacebar 
        shoot();
    }
}

function updateBullet(){
    if(!dead){
        player.bullets.forEach(bullet =>{
            let killedEnemy, canDrawBullet = true; 
            if(bullet.y >= height || bullet.y <= 0){
                player.bullets = player.bullets.filter(b => b !== bullet);
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
            for(let enem in enemies){ //check if user killed an enemy 
                let en = enemies[+enem];
                if(en !== "deleted"){
                    killedEnemy = collideRectCircle(en.quad.tlx,en.quad.tly,playerSize,playerSize,en.x,en.y,bulletSize,bulletSize); 
                    
                    //NOT MEETING THIS CONDITION 
                    if(killedEnemy){
                        playersKilled.push(enem); 
                        enemies[+enem] = "deleted";
                        canDrawBullet = false;  
                        console.log("killed player");
                    }
                }
            }
            if(canDrawBullet){
                ellipse(bullet.x,bullet.y,bulletSize,bulletSize);
            }
        });
    }
}