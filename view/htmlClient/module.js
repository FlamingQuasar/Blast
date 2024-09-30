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
}

let drawField = function(field, offsetX=0, offsetY=2){
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for(let i=0; i< field.length; i++){
        for(let j=0; j<field[i].length; j++){
            drawTileOfField(ctx, field[i][j].tileType, offsetX+12+50*i, offsetY+12+j*50);
        }
    }

    var elementslist = []
    canvas.addEventListener("click",function(){
        console.log("click")
    });
    canvas.addEventListener('mousemove', function(event) {
        event = event || window.event;
        var ctx = document.getElementById("canvas").getContext("2d")
    
        for (var i = elementslist.length - 1; i >= 0; i--){  
        
            if (elementslist[i] && ctx.isPointInPath(elementslist[i], event.offsetX, event.offsetY)) {
                document.getElementById("canvas").style.cursor = 'pointer';
                ctx.fillStyle = 'orange';
                ctx.fill(elementslist[i]);
                return
            } else {
                document.getElementById("canvas").style.cursor = 'default';
                ctx.fillStyle = 'red';
                for (var d = elementslist.length - 1; d >= 0; d--){ 
                    ctx.fill(elementslist[d]);
                }
            }
        }
    });
}
            
window.onload = function() {
    const shakeButton = document.getElementsByClassName("control-shake")[0];

    const initGame = function(){
        const shakesCountField = document.getElementById("shake-counter");
        let shakesCounter = window.getShakesCount();
        shakesCountField.innerText = shakesCounter;
        if(shakesCounter==0){
            shakeButton.classList.add("end");
        }
        else {
            shakeButton.classList.remove("end");
        }
        let field = window.showField();
        let offsetX = (FIELDSIZE-field.length*50)/2;
        let offsetY = (FIELDSIZE-field[0].length*50)/2;
        drawField(field, offsetX, offsetY);
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