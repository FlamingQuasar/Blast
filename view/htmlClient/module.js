const FIELDSIZE = 550;
const COLORTILES=["blue","orange","green","grey","pink","red","white","yellow"];

let drawTileOfField = function(ctx, color, xCoord, yCoord){
    //if(color >= COLORTILES.length) color = COLORTILES.length-1;
    //ctx.shadowColor = "white";
    let image = new Image();
    image.onload = function() { 
        ctx.drawImage(image, xCoord, yCoord, 44, 50);   
    };
    image.src = `assets/tile_${COLORTILES[color]}.png`;


    return image;
}

let drawField = function(canvas, field, offsetX=0, offsetY=2){
    


    
    var elementslist = []
    for(let i=0; i< field.length; i++){
        for(let j=0; j<field[i].length; j++){
            let myImg;

            fabric.Image.fromURL(`assets/tile_${COLORTILES[field[i][j].tileType]}.png`, function(img) 
            {
            myImg = img.set({
                                left: offsetY+12+j*50, 
                                top:  offsetX+12+50*i,
                                width:44,
                                height:50,
                                scaleY: 1,
                            });
                            myImg.testVariable="MYTESTVARIABLE-["+i+","+j+"]";
            canvas.add(myImg); 
            myImg.set('selectable', false);
            myImg.on('mousedown', function(e)
            {
            console.log("TEST");
                console.log(e?.target?.testVariable);
                console.log('image click event was simulated at: ', e.clientX, e.clientY);
            
            });
            
            });
        }
    }
}
    


    

window.onload = function() {
    const shakeButton = document.getElementsByClassName("control-shake")[0];
    const canvas = new fabric.Canvas('canvas', {selection: false});

    const initGame = function(){
        const shakesCountField = document.getElementById("shake-counter");
        const scoreCountField = document.getElementById("blscorecounter");
        const stepsCountField = document.getElementById("blstepscounter");
        let shakesCounter = window.getShakesCount();
        shakesCountField.innerText = shakesCounter;
        scoreCountField.innerText = `${window.getScoreCount()}/${window.getMaxScore()}`;
        stepsCountField.innerText = window.getStepsCount();


        if(shakesCounter==0){
            shakeButton.classList.add("end");
        }
        else {
            shakeButton.classList.remove("end");
        }
        let field = window.showField();
        let offsetX = (FIELDSIZE-field.length*50)/2;
        let offsetY = (FIELDSIZE-field[0].length*50)/2;
        
        drawField(canvas,field, offsetX, offsetY);
    }

    shakeButton.addEventListener("click", function(){
        if(window.shakeField()){
            window.showField();
            initGame();
        }
        else alert("Встряски закончились!");
    });
    initGame();

                
                
                
}