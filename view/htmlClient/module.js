
window.onload = function() {
    const FIELDSIZE = 550;
    const COLORTILES=["blue","orange","green","grey","pink","red","white","yellow"];
    const canvas = new fabric.Canvas('canvas', {selection: false});
    const shakeButton = document.getElementsByClassName("control-shake")[0];
    let tilesField = [];
    let field;
    let offsetX = 0;
    let offsetY = 0;

    // анимашка для телепортации в отличие от сгорания уменьшает тайлы и потом увеличивает, либо анимируем смену x,y
    let teleportAnimation = function(firstTile, secondTile){

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

    // Появление нового Тайла и его анимация генерации\выпадения
    function generateAnimation(newTileType, row, positionsDifference){
        //console.log("GENERATE IN UI " + newTileType + "; diff "+positionsDifference)
        let id = "id" + Math.random().toString(16).slice(2);
        createTile(0, row, offsetX, offsetY, canvas, field, newTileType, id);
       // let processNewTile =
        setTimeout(function(){
            let tiles = canvas.getObjects();
        //console.log("(1) TILE CREATED!");
        for(let tile of tiles){
            if(tile.uniqueId == id){
                console.log("!!!!!!! TILE CREATED! - " + newTileType + "diff: "+positionsDifference);
                const currentTop = tile.top;
                tile.set("opacity",0);
                const newTop = currentTop+50 * (positionsDifference-1);
                tile.animate('top', newTop, {
                    onChange: canvas.renderAll.bind(canvas),
                    duration: 100
                });
                tile.animate('opacity', 1, {
                    onChange: canvas.renderAll.bind(canvas),
                    duration: 100
                });
                tile.set("top",newTop);
                console.log("GENERATION ANIM");
                break;
            }
        }
    },200);
    }

    // отправлять этот метод в колбек для выпадания после сгорания
    function fallDownTileAnimation(r, c, positionsDifference){
        console.log("Fall down, row:"+r+"; col:"+c)
        let tiles = canvas.getObjects();
        for(let tile of tiles){
            if(tile.coordinateY == r && tile.coordinateX == c){
                console.log(tile.top);
                const currentTop = tile.top;
                const newTop = currentTop+50*positionsDifference;
                tile.animate('top', newTop, {
                    onChange: canvas.renderAll.bind(canvas),
                    duration: 100
                });
                tile.set("top",newTop);
                break;
            }
        }
    }

    function burnTileFromGroupAnimation(row, col){
        let tiles = canvas.getObjects();
        for(let tile of tiles){
            if(tile.coordinateY == row && tile.coordinateX == col){
                tile.empty = true;
                tile.animate('opacity', 0, {
                    onChange: canvas.renderAll.bind(canvas),
                    duration: 250
                });
                tile.animate('scaleX', 10, {
                    onChange: canvas.renderAll.bind(canvas),
                    duration: 500
                });
                tile.animate('scaleY', 10, {
                    onChange: canvas.renderAll.bind(canvas),
                    duration: 500
                });
                setTimeout(()=>{ canvas.remove(tile) },500);
                break;
            }
        };
    }

    let createTile = function(i, j, offsetX, offsetY, canvas, field, tileType, id){
        const uniqueId = id;
        let myImg, imgSource;
        let type = tileType==undefined? field[i][j].tileType : tileType;

        if(type == "b"){  imgSource = `assets/tile_bomb.png`; }
        else if(type =="t"){ imgSource = `assets/tile_teleport.png`;}
        else if(type=="L"){ imgSource = `assets/tile_super.png`;}
        else if(type=="_"){ imgSource = `assets/tile__.png`;}
        else imgSource = `assets/tile_${COLORTILES[field[i][j].tileType]}.png`;
        return new fabric.Image.fromURL(imgSource, function(img){
            let top = offsetX+12+i*50;
            let left = offsetY+12+j*50;
            myImg = img.set({
                left: left, 
                top:  top,
                width: 44,
                height: 50,
                opacity: 0.9
            });
            myImg.empty = false;
            myImg.coordinateX = j;
            myImg.coordinateY = i;
            if(uniqueId != undefined) console.log("UNIQUE:"+uniqueId);
            myImg.uniqueId = uniqueId;
            canvas.add(myImg); 
            myImg.set('selectable', false);

            myImg.on('mouseover', function(e){
                if(!this.empty){
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
                    /*this.animate('top', top+2, {
                        onChange: canvas.renderAll.bind(canvas),
                        duration: 100,
                        easing: fabric.util.ease.easeOutBounce
                    });*/
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
                }
            });

            myImg.on('mouseout', function(e){
                if(!this.empty){
                    this.animate('scaleY', 1, {
                        onChange: canvas.renderAll.bind(canvas)
                    });
                    this.animate('scaleX', 1, {
                        onChange: canvas.renderAll.bind(canvas)
                    });
                   /* this.animate('top', top, {
                        onChange: canvas.renderAll.bind(canvas),
                        duration: 100,
                        easing: fabric.util.ease.easeOutBounce
                    });*/
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
                }
            });

            myImg.on('mousedown', async function(e){
                if(!this.empty){
                    let coordinateY = e?.target?.coordinateY;
                    let coordinateX = e?.target?.coordinateX;
                    if(coordinateX!= undefined && coordinateY!=undefined){
                        await window.tapTile(coordinateY,coordinateX,
                            burnTileFromGroupAnimation,
                            fallDownTileAnimation,
                            generateAnimation);//.then(window.showField());
                        //setTimeout(function(){initGame()},500);
                        //initGame();
                    }
                }
            });
        
        
        });
    }

    let drawField = function(canvas, field, offsetX=0, offsetY=2){
        canvas.clear();
        tilesField = [];
        for(let i=0; i< field.length; i++){
            let row = [];
            tilesField.push(row);
            for(let j=0; j<field[i].length; j++){
                //console.log(img);
                row.push(createTile(i,j, offsetX, offsetY, canvas, field));
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
        field = window.showField();
        
        offsetX = (FIELDSIZE-field.length*50)/2;
        offsetY = (FIELDSIZE-field[0].length*50)/2;
        
        drawField(canvas,field, offsetX, offsetY);
    }

    shakeButton.addEventListener("click", function(){
        if(window.shakeField()){
            window.showField();
            alert("shake");
            initGame();
        }
        else alert("Встряски закончились!");
    });
    initGame();

                
                
                
}