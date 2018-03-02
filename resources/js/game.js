"use strict"; 
let x,
    y,
    bullets = [],
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
        dir: playerDir.UP
    },
    currentDir = playerDir.UP;
function setup() {
    console.log(this);
    socket = io(); 
    height = windowHeight-15;
    width = windowWidth-15; 
    x = random(width); 
    y = random(height); 
    createCanvas(width, height);
}
function draw() {
    if(keyIsDown(playerDir.UP)){ //w   i.e. up 
        y-=4;
        player.dir = playerDir.UP
    }else if(keyIsDown(playerDir.LEFT)){//a  i.e. left
        x-=4;
        player.dir = playerDir.LEFT
    }else if(keyIsDown(playerDir.DOWN)){//s   i.e. down
        y+=4;
        player.dir = playerDir.DOWN
    } else if(keyIsDown(playerDir.RIGHT)){//d  i.e. right 
        x+=4;
        player.dir = playerDir.RIGHT
    }

    clear();
    background(0,0,0);
    updateBullet();
    //update player coords 
    player.quad.tlx = x; 
    player.quad.tly = y;
    player.quad.trx = x+playerSize; 
    player.quad.try = y;
    player.quad.brx = x+playerSize; 
    player.quad.bry = y+playerSize;
    player.quad.blx = x; 
    player.quad.bly = y+playerSize;

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
}
function shoot(){
    bullets.push({x: x, y: y});
}

function keyPressed(){
    if(keyCode === 32){//spacebar 
        shoot();
    }
}

function updateBullet(){
    bullets.forEach(item =>{
        if(item.y >= height || item.y <= 0){
            bullets = bullets.filter(e => e !== item);
        }else{
        item.y -= 10;
        }
        ellipse(item.x,item.y,10,10);
    });
}