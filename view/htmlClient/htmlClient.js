
window.onload = function() {
    const FIELDSIZE = 550;
    const COLORTILES=["blue","orange","green","grey","pink","red","white","yellow"];
    const canvas = new fabric.Canvas('canvas', {selection: false});
    const shakeButton = document.getElementsByClassName("control-shake")[0];
    //let tilesField = [];
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
        
        // сгенерировать уникальный ключ для новых тайлов 
        // по ключу мы найдем тайл в canvas.getObjects() (библиотека Fabric)
        let id = "id" + Math.random().toString(16).slice(2);
        
        if(newTileType == undefined) return;
        createTile(0, row, offsetX, offsetY, canvas, field, newTileType, id);
        
       setTimeout(function(){
            let tiles = canvas.getObjects();
            for(let tile of tiles){
                if(tile.uniqueId == id){
                    const currentTop = tile.top;
                    tile.set("opacity",0);
                    const newTop = currentTop+50 * (positionsDifference-1);
                    tile.animate('top', newTop, {
                        onChange: canvas.renderAll.bind(canvas),
                        duration: 100
                    });
                    tile.animate('opacity', 1, {
                        onChange: canvas.renderAll.bind(canvas),
                        duration: 200
                    });
                    tile.set("top",newTop);
                    break;
                }
            }
        },100);
    }

    // отправлять этот метод в колбек для выпадания после сгорания
    function fallDownTileAnimation(r, c, positionsDifference){
        let tiles = canvas.getObjects();
        for(let tile of tiles){
            if(tile.coordinateY == r && tile.coordinateX == c){
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

        // Определиться с типом тайла для отображения
        let type = tileType==undefined ? field[i][j]?.tileType : tileType;
        if(type == "b"){  imgSource = `assets/tile_bomb.png`; }
        else if(type =="t"){ imgSource = `assets/tile_teleport.png`;}
        else if(type=="L"){ imgSource = `assets/tile_super.png`;}
        else if(type=="_" || type==undefined){ imgSource = `assets/tile__.png`;}
        else imgSource = (tileType != undefined)? 
            `assets/tile_${COLORTILES[tileType]}.png` :
            `assets/tile_${COLORTILES[field[i][j].tileType]}.png`;

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
            //if(uniqueId != undefined) console.log("UNIQUE:"+uniqueId);
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
                            generateAnimation,
                            refreshAllField
                        );//.then(window.showField());
                        //setTimeout(function(){initGame()},500);
                        //initGame();
                    }
                }
            });
        });
    //}
    }
    
    const refreshAllField = function(){

        console.log("INIT AFTER STEP - 1")
        initGame();
    }
    

    let drawField = function(canvas, field, offsetX=0, offsetY=2){
        
        canvas.clear();
        for(let i=0; i< field.length; i++){
            for(let j=0; j<field[i].length; j++){
                    createTile(i,j, offsetX, offsetY, canvas, field);
            }
        }
    }

    const initGame = function(){
        console.log("INIT AFTER STEP - 2")
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
        field = window.showField();
        console.log(field);
        offsetX = (FIELDSIZE-field.length*50)/2;
        offsetY = (FIELDSIZE-field[0].length*50)/2;
        
        drawField(canvas,field, offsetX, offsetY);
    }

    shakeButton.addEventListener("click", function(){
        if(window.shakeField()){
            initGame();
        }
        else alert("Встряски закончились!");
    });
    initGame();

                
                
                
}