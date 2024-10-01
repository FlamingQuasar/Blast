
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

// анимашка для телепортации в отличие от сгорания уменьшает тайлы и потом увеличивает, либо анимируем смену x,y
let teleportAnimation = function(firstTile, secondTile){

}

// отправлять этот метод в колбек для выпадания после сгорания
let fallAnimation = function(tileImage, positionY, canvas, fabric){

}

// отправлять этот метод или расширенную версию принимающую только x,y матрицы в колбек для действий
let boomBurnAnimation = function(tileImage, canvas, fabric){
    tileImage.animate('scaleY', 10, {
        onChange: canvas.renderAll.bind(canvas),
        duration: 100,
    });
    tileImage.animate('scaleX', 10, {
        onChange: canvas.renderAll.bind(canvas),
        duration: 100,
    });
    tileImage.animate('opacity', 0, {
        onChange: canvas.renderAll.bind(canvas),
        duration: 100,
        easing: fabric.util.ease.easeOutBounce
    });
}
function burnTileFromGroupAnimation(row, col){
    console.log("burn same pairs animation");
    console.log(row + "; "+col);
    alert(row + "; "+col);
    //tiles;
}
let tiles;
let drawField = function(canvas, field, offsetX=0, offsetY=2){
    canvas.clear();
    tiles = [];
    for(let i=0; i< field.length; i++){
        let row = [];
        tiles.push(row)
        for(let j=0; j<field[i].length; j++){
            let myImg, imgSource;
            let type = field[i][j].tileType;

            if(type == "b"){  imgSource = `assets/tile_bomb.png`; }
            else if(type =="t"){ imgSource = `assets/tile_teleport.png`;}
            else if(type=="L"){ imgSource = `assets/tile_super.png`;}
            else if(type=="_"){ imgSource = `assets/tile__.png`;}
            else imgSource = `assets/tile_${COLORTILES[field[i][j].tileType]}.png`;

            let img = fabric.Image.fromURL(imgSource, function(img){
                let top = offsetX+12+i*50;
                let left = offsetY+12+j*50;
                myImg = img.set({
                    left: left, 
                    top:  top,
                    width: 44,
                    height: 50,
                    opacity: 0.9
                });
                myImg.coordinateX = j;
                myImg.coordinateY = i;
                canvas.add(myImg); 
                myImg.set('selectable', false);

                myImg.on('mouseover', function(e){
                    this.animate('scaleY', 0.9, {
                        onChange: canvas.renderAll.bind(canvas),
                        duration: 100,
                        easing: fabric.util.ease.easeOutBounce
                    });
                    this.animate('scaleX', 0.9, {
                        onChange: canvas.renderAll.bind(canvas),
                        duration: 100,
                        easing: fabric.util.ease.easeOutBounce
                    });
                    this.animate('top', top+2, {
                        onChange: canvas.renderAll.bind(canvas),
                        duration: 100,
                        easing: fabric.util.ease.easeOutBounce
                    });
                    this.animate('left', left+2, {
                        onChange: canvas.renderAll.bind(canvas),
                        duration: 100,
                        easing: fabric.util.ease.easeOutBounce
                    });
                    this.animate('opacity', 1, {
                        onChange: canvas.renderAll.bind(canvas),
                        duration: 100,
                        easing: fabric.util.ease.easeOutBounce
                    });                    
                });

                myImg.on('mouseout', function(e){
                    this.animate('scaleY', 1, {
                        onChange: canvas.renderAll.bind(canvas)
                    });
                    this.animate('scaleX', 1, {
                        onChange: canvas.renderAll.bind(canvas)
                    });
                    this.animate('top', top, {
                        onChange: canvas.renderAll.bind(canvas),
                        duration: 100,
                        easing: fabric.util.ease.easeOutBounce
                    });
                    this.animate('left', left, {
                        onChange: canvas.renderAll.bind(canvas),
                        duration: 100,
                        easing: fabric.util.ease.easeOutBounce
                    });
                    this.animate('opacity', 0.9, {
                        onChange: canvas.renderAll.bind(canvas),
                        duration: 100,
                        easing: fabric.util.ease.easeOutBounce
                    });
                });

                myImg.on('mousedown', async function(e){
                    console.log("CLICK");
                    let coordinateY = e?.target?.coordinateY;
                    let coordinateX = e?.target?.coordinateX;
                    if(coordinateX!= undefined && coordinateY!=undefined){
                       
                        function generateAndFallAnimation(first,sec){

                            console.log(first)
                            console.log(sec)
                        }
                        await window.tapTile(coordinateY,coordinateX,
                            burnTileFromGroupAnimation,
                            generateAndFallAnimation);//.then(window.showField());
                        setTimeout(function(){initGame()},500);
                    }
                });
            
            
            });
            
            row.push(img);
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