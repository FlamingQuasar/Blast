import { BombBooster } from './bombBooster.js';
import { SuperBooster } from './superBooster.js';
import { TeleportBooster } from './teleportBooster.js';
import { Tile } from './tile.js'

// Класс "игровое поле" ведёт себя как массив с добавлением методов
export class Field{

    static settings = {};

    // Проинициализировать(связать с текущей фишкой) предыдущих "соседей" фишки (сверху и слева)
    static initTopAndLeftTileNeighbour(currentTile, matrix, row, col) {
        currentTile.initNeighbours((col>0) ? matrix[row][col-1] : null,
            (row>0) ? matrix[row-1][col] : null,null,null);
    }

    // Вернуть массив с измененным порядком объектов для присвоения массиву с прямым порядком
    static swap(leftObj, rightObj){
        return [rightObj, leftObj];
    }

    static isEmptySettings(settings = Field.settings){
        for(const prop in settings){ 
            if(Object.hasOwn(settings, prop)){
                return false;
            }
        }
        return true;
    }

    static createFieldMatrix(settings = Field.settings){
        if(Field.isEmptySettings(settings)) return undefined;
        const matrix = []; // двумерный массив фишек(тайлов) для игрового поля
        for(let i=0; i<settings.fieldHeight; i++){
            let row = [];
            matrix.push(row);
            for(let j=0; j<settings.fieldWidth;j++){
                let tile = new Tile({field:matrix, colorsCount:settings.colorsCount, 
                                minimalGroup:settings.minimalGroup});
                row.push(tile);
                Field.initTopAndLeftTileNeighbour(tile, matrix, i, j);
            }
        }
        return matrix;
    }

    static async tapTile(questionText){
        console.log("tap from static async Field.tapTile")
        if(Field.tapTileHandler != undefined){
            console.log("Field.tapTileHandler != undefined");
            return await Field.tapTileHandler(questionText);
        }
        return 0;
    }

    constructor({settings, tapTileHandler}={}){
        Field.settings = settings;
        Field.tapTileHandler = tapTileHandler;
        this.matrix = Field.createFieldMatrix(); // двумерный массив фишек(тайлов) для игрового поля
        // Для быстроты работы с массивом-игровым полем, передадим методы класса Field в матрицу 
        this.matrix.activateTileAndGetScore = this.activateTileAndGetScore;
        this.matrix.checkPairs = this.checkPairs;
        this.matrix.replaceAfterBurn = this.replaceAfterBurn;
        this.matrix.generateNewTiles = this.generateNewTiles;
        this.matrix.shakeField = this.shakeField;
        this.matrix.updateNeighbourRelations = this.updateNeighbourRelations;
        this.matrix.fieldHaveOccurrence = this.fieldHaveOccurrence;
        this.matrix.getTileOnPosition = this.getTileOnPosition;
        this.matrix.getPositionOfTile = this.getPositionOfTile;
        this.matrix.generateTileWithBoostersProbability = this.generateTileWithBoostersProbability;
        this.matrix.checkIfFieldHaveTile = this.checkIfFieldHaveTile;
        return this.matrix;
    }

    /**
     * Найти позицию тайла в матрице игрового поля
     * @param {Tile} tile искомый тайл
     * @returns позиция {row, col}
     */
    getPositionOfTile(tile){
        for(let i=0; i<this.length; i++){
            for(let j=0; j<this[i].length; j++){
                if (this[i][j] == tile) return {row:i, col:j};
            }
        }
        return undefined;
    }
    /**
    * Защищенный способ получить Фишку(Тайл) с указанной позиции, если он там есть, иначе вернет false
    * @param {array} position - позиция [row,col]*/
    getTileOnPosition([row, col]){
        if(this[row] != undefined && this[row][col] != undefined){
            return this[row][col];
        }
        return null;
    }

    // Проверить, есть ли во всем игровом поле совпадения (для составления пар перемешиванием)
    fieldHaveOccurrence(){
        let allMatrix = [];
        for(let i=0; i<Field.settings.fieldHeight; i++){
            this[i].map(tile => allMatrix.push(tile.tileType));
        }
        if(new Set(allMatrix).size !== allMatrix.length){
            return true;
        }
        return false;
    }

    // Перемешать фишки\тайлы на игровом поле
    shakeField(){
        for(let i=0; i<Field.settings.fieldHeight; i++){
            for(let j=0; j<Field.settings.fieldWidth; j++){
                // Позиция фишки-пары для перетасовывания
                let k = Math.floor(Math.random() * Field.settings.fieldWidth);
                if(k != j){
                    // Поменять местами два случайных тайла с помощью специального хинта;
                    // наличие метода под повторяющееся дейсnвие - хороший подход
                    [this[i][j], this[i][k]] = Field.swap(this[i][j], this[i][k]);
                    this[i][j].hasSameNeighbour = false;
                    this[i][k].hasSameNeighbour = false;
                }
                // Позиция целой "строки" фишек\тайлов для перетасовывания
                let m = Math.floor(Math.random() * Field.settings.fieldHeight);
                if(m != i){
                    // Поменять местами две строки тайлов с помощью специального хинта;
                    [this[i], this[m]] = Field.swap(this[i], this[m]);
                }
            }
        }

        // Если вообще нет одинаковых цветов во всей матрице, создать "пару"
        if(!this.fieldHaveOccurrence(this) 
            && this[0] != undefined 
            && this[0][0] != undefined
            && this[0][1] != undefined){
                this[0][1].tileType = this[0][0].tileType;
                this[0][0].hasSameNeighbour = true;
                this[0][1].hasSameNeighbour = true;
        }

        // Обновить ссылки на соседей всех фишек поля
        this.updateNeighbourRelations();
    }

    // Попробовать "сжечь тайлы" при активации ячейки
    async activateTileAndGetScore(row, col, message, game, burnAnimationCallback){
        if(this[row] === undefined || this[row][col] === undefined 
            || this[row][col].tileType === Tile.EMPTYTILE){
            return 0; // вернуть 0 очков
        }
        let scoreToAdd = 0;
        // случай с тайлом-телепортом - метод требует ожидания второго тайла
        if(this[row][col].fireTileReturnScore.constructor.name == "AsyncFunction"){
            console.log("call AsyncFunction to get score");
            scoreToAdd = await this[row][col].fireTileReturnScore(message);
        } else {
            scoreToAdd = this[row][col].fireTileReturnScore(1, burnAnimationCallback);
            //console.clear();
            game.showFieldAndState();
        }
        return scoreToAdd; // вернуть 0 очков прибавки
    }
    
    /**
    * Проверить, есть ли уже на Игровом поле тайл данного типа
    * @param {string} tileType - тип тайла\бустера
    */
    checkIfFieldHaveTile(tileType){
        for(let i=0; i<Field.settings.fieldHeight; i++){
            for(let j=0; j<Field.settings.fieldWidth; j++){
                if(this[i][j].tileType == tileType)
                    return true;
            }
        }
        return false;
    }

    /**
    * Сгенерировать либо тайл, либо бонус, если бонус данного типа еще не находится на карте
    * @param {object.number} bombProbability - вероятность появления бомбы
    * @param {object.string} teleportProbability - вероятность появления телепорта
    */
    generateTileWithBoostersProbability({bombProbability=0.1, teleportProbability=0.1}){
        let tileToReturn = null;
        if(bombProbability>0 && !this.checkIfFieldHaveTile(BombBooster.TILETYPE)){
            // Проверить, есть ли на карте бонус-бомба если нет, добавить вероятность его появления
            if( Math.random()+bombProbability/100 >= 1){
                tileToReturn = new BombBooster({field:this, radius:Field.settings.bombRadius});
            }
        }
        if(teleportProbability>0 && !this.checkIfFieldHaveTile(TeleportBooster.TILETYPE)){
            // Проверить, есть ли на карте бонус-телепорт, если нет, добавить вероятность его появления
            if( Math.random()+teleportProbability/100 >= 1){
                tileToReturn = new TeleportBooster({field:this});
            }
        }
        // Если вероятности не сработали, добавить простой тайл
        return (tileToReturn != null) ? tileToReturn : 
            new Tile({field: this,
                colorsCount:Field.settings.colorsCount, 
                minimalGroup:Field.settings.minimalGroup});
    }

    /**
    * Сгенерировать сверху новые фишки после "сгоревших"
    * @param {array} newTilesGenerationMask - массив-"маска" количества пустых тайлов в каждом столбце
    */
    generateNewTiles(newTilesGenerationMask = [], genCallback=()=>{}, refreshAllFieldOnUICallback=()=>{}){
        if(!newTilesGenerationMask.length) return;
        // добавить 100% появление супер-тайла если маска сгоревшей группы больше L
        let maxBurnedTilesColumn = Math.max(...newTilesGenerationMask);
        let sumBurnedTiles = 0;
        for(let burned of newTilesGenerationMask){
            sumBurnedTiles += burned;
        }
        let counterOfGenerations = newTilesGenerationMask.map(() => 1);
        for(let i = 0; i< maxBurnedTilesColumn; i++){
            for(let j=0; j<Field.settings.fieldWidth; j++){
                // Если номер текущей строки меньше чем количество пустот в данном стобце
                if(i < newTilesGenerationMask[j]){
                    if(sumBurnedTiles >= Field.settings.largeGroupBonusRequirement){
                        this[i][j] = new SuperBooster({field : this});
                        genCallback(SuperBooster.TILETYPE, j, counterOfGenerations[j]);
                        sumBurnedTiles = 0;
                    }
                    else {
                        this[i][j] = this.generateTileWithBoostersProbability({bombProbability:Field.settings.boosterProbability, 
                                                                        teleportProbability:Field.settings.boosterProbability});
                        genCallback(this[i][j].tileType, j, counterOfGenerations[j]);
                    }
                    counterOfGenerations[j]++;
                }
            }
        }
        // callbackFunction(newTilesGenerationMask, this);
        // Обновить ссылки на соседей всех фишек поля
        this.updateNeighbourRelations();
        // Вызов колбек функции для обновления UI в соответствующем модуле
        refreshAllFieldOnUICallback();
    }

    // Обновить ссылки на соседей всех фишек поля
    updateNeighbourRelations(){
        for(let i=0; i<Field.settings.fieldHeight; i++){
            for(let j=0; j<Field.settings.fieldWidth; j++){
                Field.initTopAndLeftTileNeighbour(this[i][j], this, i, j);
            }
        }
    }

    // Запустить механизм выпадения новых фишек и перемещения
    replaceAfterBurn(showBurnedTiles = false, fallCallback=()=>{}, genCallback=()=>{}){
        console.log(fallCallback);
        // Подготовить массив счетчиков для генерации новых фишек
        let newTilesGenerationMask = [];
        for(let i=0; i<Field.settings.fieldWidth; i++)
            newTilesGenerationMask.push(0);

        // Обойти игровое поле снизу вверх
        for(let i=Field.settings.fieldHeight-1; i>=0; i--){
            for(let j=0; j<Field.settings.fieldWidth; j++){
                // текущее место - сгоревшее и есть куда двигать
                if(this[i][j].tileType == Tile.EMPTYTILE && i-1 >= 0){
                    // Попробовать сдвинуть на "сгоревшее" место ближайшую фишку сверху
                    for(let k=i-1; k>=0; k--){
                        if(this[k][j].tileType != Tile.EMPTYTILE){
                            fallCallback(k, j, i-k);
                            // Поменять местами два тайла с помощью специального хинта;
                            [this[i][j], this[k][j]] = Field.swap(this[i][j], this[k][j]);
                            
                            this[k][j].hasSameNeighbour = false;
                            this[i][j].hasSameNeighbour = false;
                            break;
                        }
                    }
                }
            }
        }

        // Проинициализировать соседние фишки (связать соседей)
        for(let i=0; i<Field.settings.fieldHeight; i++){
            for(let j=0; j<Field.settings.fieldWidth; j++){                
                if(this[i][j].tileType == Tile.EMPTYTILE){
                    // Если фишка при обходе снизу "сгоревшая" - прибавить счетчик необходимых к генерации фишек
                    newTilesGenerationMask[j]++;
                }
                // Обновить ссылки на соседей всех фишек поля
                Field.initTopAndLeftTileNeighbour(this[i][j], this, i, j);
            }
        }

        // Показать если надо промежуточную матрицу с пустотами
        if(showBurnedTiles){
            let fieldMatrix = "";
            for(let i=0; i<Field.settings.fieldHeight; i++){
                for(let j=0; j<Field.settings.fieldWidth;j++){
                    fieldMatrix += `${this[i][j].tileType} \t`;
                }
                fieldMatrix += "\n";
            }
            console.log(fieldMatrix);
        }

        // Сгенерировать новые фишки
        this.generateNewTiles(newTilesGenerationMask, genCallback);
    }

    // Узнать, есть ли вообще группы (заданного минимального числа)
    checkPairs(){
        let hasPairsFlag = false;
        outer:
        for(let i=0; i<Field.settings.fieldHeight; i++){
            for(let j=0; j<Field.settings.fieldWidth;j++){
                hasPairsFlag = this[i][j].hasSameNeighbour;
                if(hasPairsFlag) break outer;
            }
        }
        return hasPairsFlag;
    }
}