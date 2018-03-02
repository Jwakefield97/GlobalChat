"use strict"; 
let x = 200,
    y= 200,
    bullets = [],
    height = 640,
    width = 480;
function setup() {
    console.log(this);
    createCanvas(height, width);
}

function draw() {
    if(keyIsDown(LEFT_ARROW)){
        x-=3;
    }
    if(keyIsDown(RIGHT_ARROW)){
        x+=3;
    }
    if(keyIsDown(UP_ARROW)){
        y-=3;
    }
    if(keyIsDown(DOWN_ARROW)){
        y+=3;
    }
    if(keyIsDown(ENTER)){
        shoot();
    }

    clear();
    updateBullet();
    ellipse(x,y,80,80);
    }
    function shoot(){
    bullets.push({x: x, y: y});
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