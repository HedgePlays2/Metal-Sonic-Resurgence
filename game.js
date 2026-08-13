* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}


html,
body {

    width: 100%;
    height: 100%;

    overflow: hidden;

    background: #000;

    font-family: Arial, Helvetica, sans-serif;

}



body {

    display: flex;

    justify-content: center;

    align-items: center;

}



/* =========================
   GAME WINDOW
========================= */


#game-container {

    position: relative;

    width: 100vw;
    height: 100vh;

    overflow: hidden;

    background: #000;

}



/* =========================
   CANVAS
========================= */


#gameCanvas {

    position: absolute;

    left: 0;
    top: 0;


    width: 100%;
    height: 100%;


    display: block;


    image-rendering: pixelated;

}



/* =========================
   TITLE SCREEN
========================= */


#title-screen {

    position: absolute;

    inset: 0;


    z-index: 10;


    display: flex;

    justify-content: center;

    align-items: center;


    text-align: center;


    background:

        radial-gradient(
            circle,
            #355d99,
            #182946 50%,
            #05070d
        );

}



.title-content {

    display: flex;

    flex-direction: column;

    align-items: center;

}



/* =========================
   LOGO TEXT
========================= */


.small-title {

    color: #168cff;


    font-size: clamp(
        20px,
        4vw,
        42px
    );


    font-weight: 900;

    font-style: italic;


    letter-spacing: 8px;


    text-shadow:

        4px 4px 0 #000,

        0 0 25px #168cff;

}



h1 {

    margin-top: 5px;


    color: white;


    font-size: clamp(
        50px,
        10vw,
        120px
    );


    font-weight: 900;

    font-style: italic;


    line-height: .85;


    letter-spacing: -6px;


    text-shadow:

        7px 7px 0 #000,

        0 0 35px #168cff;

}



.subtitle {

    margin-top: 20px;


    color: #c5d4ec;


    font-size: clamp(
        9px,
        1.4vw,
        15px
    );


    font-weight: bold;


    letter-spacing: 4px;

}



/* =========================
   BUTTON
========================= */


#start-button {


    margin-top: 40px;


    padding:

        16px 50px;


    border:

        3px solid white;


    border-radius: 5px;


    background: #168cff;


    color:white;


    font-size: 20px;


    font-weight:900;


    letter-spacing:3px;


    cursor:pointer;



    box-shadow:

        0 7px 0 #07519b,

        0 0 30px #168cff;


}



#start-button:hover {


    background:#42a7ff;


}



#start-button:active {


    transform:translateY(5px);


    box-shadow:

        0 2px 0 #07519b;


}



/* =========================
   CONTROLS
========================= */


.controls {


    display:flex;


    gap:25px;


    margin-top:30px;


    color:white;


    font-size:10px;


    font-weight:bold;


}



.controls div {


    display:flex;


    flex-direction:column;


}



.controls span {


    color:#8fa4c7;


    font-size:8px;


    margin-top:3px;


}



.version {


    margin-top:25px;


    color:#667995;


    font-size:8px;


    letter-spacing:3px;


}





/* =========================
   LOADING
========================= */


#loading {


    position:absolute;


    inset:0;


    z-index:20;


    display:none;


    justify-content:center;


    align-items:center;


    background:#05070d;


    color:white;


}



.loading-content {


    text-align:center;


}



.loading-title {


    color:#168cff;


    font-size:25px;


    font-weight:900;


    font-style:italic;


}



.loading-text {


    margin-top:10px;


    color:#9aa9c4;


    font-size:10px;


    letter-spacing:2px;


}



.loading-bar {


    width:280px;


    height:8px;


    margin-top:20px;


    background:#18263d;


}



.loading-bar-fill {


    height:100%;


    width:0%;


    background:#168cff;


}





/* =========================
   HUD
========================= */


#hud {


    position:absolute;


    top:20px;


    left:25px;


    z-index:5;


    display:none;


    color:white;


    font-weight:bold;


    text-shadow:

        3px 3px 0 #000;


}



.hud-character {


    color:#168cff;


    margin-bottom:8px;


    font-size:14px;


}



.hud-row {


    display:flex;


    gap:30px;


    font-size:16px;


}





/* =========================
   PAUSE
========================= */


#pause-button {


    position:absolute;


    top:20px;


    right:25px;


    z-index:30;


    display:none;


    width:42px;


    height:42px;


    border:2px solid white;


    background:rgba(0,0,0,.5);


    color:white;


    font-weight:900;


    font-size:18px;


}





/* =========================
   MOBILE
========================= */


@media(max-width:600px){


    h1 {

        font-size:50px;

    }


    .controls {

        gap:10px;

    }


    #start-button {

        padding:13px 35px;

        font-size:16px;

    }


}
