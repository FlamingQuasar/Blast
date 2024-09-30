const FIELDSIZE = 550;
const COLORTILES=["blue","orange","green","grey","pink","red","white","yellow"];

let drawImage = function(ctx, xCoord, yCoord, color){                   
    var image = new Image();
    image.onload = function() { 
        ctx.drawImage(image, xCoord, yCoord, 44, 50);   };
    image.src = `assets/tile_${COLORTILES[color]}.png`;
}

let drawField = function(field, offsetX=0, offsetY=2){
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d'); 
    for(let i=0; i< field.length; i++){
        for(let j=0; j<field[i].length; j++){
            drawImage(ctx, offsetX+12+50*i, offsetY+12+j*50, 1);
        }
    }
}
            window.onload = function() {
                let field = window.startFunc();
                let offsetX = (FIELDSIZE-field.length*50)/2;
                let offsetY = (FIELDSIZE-field[0].length*50)/2;
                drawField(field,offsetX,offsetY);

                
                var elementslist = []
                
                

                /*const circle = new Path2D();
                circle.arc(50, 75, 30, 0, 2 * Math.PI);
                ctx.fillStyle = 'red';
                ctx.fill(circle);
                
                const circletwo = new Path2D();
                circletwo.arc(150, 75, 30, 0, 2 * Math.PI);
                ctx.fillStyle = 'red';
                ctx.fill(circletwo);*/
                
                const circlethree = new Path2D();
                circlethree.arc(250, 75, 30, 0, 2 * Math.PI);
                ctx.fillStyle = 'red';
                ctx.fill(circlethree);
                
                elementslist.push(/*circle,circletwo,*/circlethree)
                
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

                //window.onload = function () {
                
                //console.log(BlastGame);
    //var canvas = document.getElementById('images_demo');
    /*var context = canvas.getContext('2d');
    var image = new Image();
    image.click = function(){
        console.log("CLICK")
    }
        
    var image = new Image();
    image.onload = function() { 
    context.drawImage(image, 12, 10, 44, 50);   };
    
    image.src = 'assets/tile_blue.png';
	setTimeout(function(){
		context.drawImage(image, 12, 10, 44, 50);
       context.drawImage(image, 62, 10, 44, 50);
       context.drawImage(image, 112, 10, 44, 50);
       context.drawImage(image, 162, 10, 44, 50);
       context.drawImage(image, 212, 10, 44, 50);
       context.drawImage(image, 262, 10, 44, 50);
       context.drawImage(image, 312, 10, 44, 50);
       context.drawImage(image, 362, 10, 44, 50);
       context.drawImage(image, 412, 10, 44, 50);
       context.drawImage(image, 462, 10, 44, 50);
       context.drawImage(image, 512, 10, 44, 50);
	},1000);
      
    image.src = 'assets/tile_blue.png';*/
}