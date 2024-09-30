
window.onload = function() {
const FIELDSIZE = 550;
const COLORTILES=["blue","orange","green","grey","pink","red","white","yellow"];
const canvas = new fabric.Canvas('canvas', {selection: false});
const shakeButton = document.getElementsByClassName("control-shake")[0];

let drawTileOfField = function(ctx, color, xCoord, yCoord){
    //if(color >= COLORTILES.length) color = COLORTILES.length-1;
    //ctx.shadowColor = "white";
    let image = new Image();
    image.onload = function() { 
        ctx.drawImage(image, xCoord, yCoord, 44, 50);   
    };
    if(color == "b"){ image.src = `assets/tile_bomb.png`; }
    else if(color =="t"){ image.src = `assets/tile_teleport.png`;}
    else if(color=="L"){ image.src = `assets/tile_super.png`;}
    else image.src = `assets/tile_${COLORTILES[color]}.png`;


    return image;
}

let drawField = function(canvas, field, offsetX=0, offsetY=2){
    canvas.clear();
    for(let i=0; i< field.length; i++){
        for(let j=0; j<field[i].length; j++){
            let myImg, imgSource;
            let type = field[i][j].tileType;

            if(type == "b"){  imgSource = `assets/tile_bomb.png`; }
            else if(type =="t"){ imgSource = `assets/tile_teleport.png`;}
            else if(type=="L"){ imgSource = `assets/tile_super.png`;}
            else if(type=="_"){ imgSource = `assets/tile__.png`;}
            else imgSource = `assets/tile_${COLORTILES[field[i][j].tileType]}.png`;

            fabric.Image.fromURL(imgSource, function(img){
                let top = offsetX+12+i*50;
                myImg = img.set({
                    left: offsetY+12+j*50, 
                    top:  top,
                    width: 44,
                    height: 50,
                    opacity: 0.9
                });
                myImg.coordinates=""+i+","+j;
                canvas.add(myImg); 
                myImg.set('selectable', false);

                myImg.on('mouseover', function(e){
                    this.animate('scaleY', 0.9, {
                        onChange: canvas.renderAll.bind(canvas),
                        duration: 100,
                        easing: fabric.util.ease.easeOutBounce
                    });
                    this.animate('top', top+2, {
                        onChange: canvas.renderAll.bind(canvas),
                        duration: 100,
                        easing: fabric.util.ease.easeOutBounce
                    });
                    this.animate('opacity', 1, {
                        onChange: canvas.renderAll.bind(canvas),
                        duration: 100,
                        easing: fabric.util.ease.easeOutBounce
                    });
                    console.log("mouseover");
                    
                });
                myImg.on('mouseout', function(e){                
                    this.animate('scaleY', 1, {
                        onChange: canvas.renderAll.bind(canvas)
                    });
                    this.animate('top', top-2, {
                        onChange: canvas.renderAll.bind(canvas),
                        duration: 100,
                        easing: fabric.util.ease.easeOutBounce
                    });
                    this.animate('opacity', 0.9, {
                        onChange: canvas.renderAll.bind(canvas),
                        duration: 100,
                        easing: fabric.util.ease.easeOutBounce
                    });
                    console.log("mouseout");
                });

                myImg.on('mousedown', async function(e){
                    let coordinates = e?.target?.coordinates;
                    console.log(coordinates);
                    if(coordinates){
                        let splitCoords = coordinates.split(",");
                        await window.tapTile(splitCoords[0],splitCoords[1], ()=>{});//.then(window.showField());
                        initGame();
                    }
                });
            
            });
        }
    }
}
    


    


    const initGame = function(){
        
        const shakesCountField = document.getElementById("shake-counter");
        const scoreCountField = document.getElementById("blscorecounter");
        const stepsCountField = document.getElementById("blstepscounter");
        let shakesCounter = window.getShakesCount();
        shakesCountField.innerText = shakesCounter;
        scoreCountField.innerText = `${window.getScoreCount()}/${window.getMaxScore()}`;
        stepsCountField.innerText = window.getStepsCount();


        /*if(shakesCounter==0){
            shakeButton.classList.add("end");
        }
        else {
            shakeButton.classList.remove("end");
        }*/
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