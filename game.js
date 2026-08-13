const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");


const startButton = document.getElementById("start-button");
const titleScreen = document.getElementById("title-screen");
const hud = document.getElementById("hud");


let gameStarted = false;


let keys = {};



// SPRITES

const sprites = {

    idle:new Image(),

    run:new Image(),

    jump:new Image()

};


sprites.idle.src="sprites/idle.png";
sprites.run.src="sprites/run.png";
sprites.jump.src="sprites/jump.png";




// WORLD

const world = {

    width:3000,

    ground:200

};




// METAL SONIC

const metal = {

    x:80,

    y:120,


    width:32,

    height:45,


    velocityX:0,

    velocityY:0,


    speed:4,

    jumpPower:-9,


    grounded:false

};




// CAMERA

let camera = {

    x:0

};




// RINGS

const rings = [

    {x:300,y:150},

    {x:350,y:150},

    {x:400,y:150},

    {x:500,y:150}

];




// INPUT

window.addEventListener(
"keydown",
e=>{

keys[e.key.toLowerCase()]=true;

});


window.addEventListener(
"keyup",
e=>{

keys[e.key.toLowerCase()]=false;

});




// START

startButton.onclick=()=>{

gameStarted=true;

titleScreen.style.display="none";

hud.style.display="block";

};




// UPDATE

function update(){


if(!gameStarted)
return;



// movement

if(keys["arrowright"])
metal.velocityX=metal.speed;


else if(keys["arrowleft"])
metal.velocityX=-metal.speed;


else
metal.velocityX*=0.8;



metal.x+=metal.velocityX;




// jump

if(keys[" "] && metal.grounded){

metal.velocityY=-9;

metal.grounded=false;

}



// gravity

metal.velocityY+=0.45;

metal.y+=metal.velocityY;




// ground

if(
metal.y+metal.height >= world.ground
){

metal.y=world.ground-metal.height;

metal.velocityY=0;

metal.grounded=true;

}




// camera

camera.x=metal.x-212;


if(camera.x<0)
camera.x=0;

}




// SPRITE

function getSprite(){

if(!metal.grounded)
return sprites.jump;


if(Math.abs(metal.velocityX)>0.2)
return sprites.run;


return sprites.idle;

}




// DRAW

function draw(){



ctx.fillStyle="#5db8ff";

ctx.fillRect(
0,
0,
424,
240
);



ctx.save();


ctx.translate(
-camera.x,
0
);



// ground

ctx.fillStyle="#32b34a";

ctx.fillRect(
0,
world.ground,
world.width,
40
);



// rings

for(let ring of rings){

ctx.strokeStyle="#ffd83d";

ctx.lineWidth=1.5;


ctx.beginPath();

ctx.arc(

ring.x,

ring.y,

4,

0,

Math.PI*2

);

ctx.stroke();

}



// metal

let sprite=getSprite();


if(sprite.complete){

ctx.drawImage(

sprite,

metal.x-2,

metal.y-4,

32,

45

);

}


ctx.restore();


}



// LOOP

function loop(){

update();

draw();

requestAnimationFrame(loop);

}


loop();
