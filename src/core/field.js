import { FieldItem } from './fieldItem.js'

// Класс "игровое поле" ведёт себя как массив с добавлением методов
export class Field{

    static settings = {};
    // Проинициализировать(связать с текущей фишкой) предыдущих "соседей" фишки (сверху и слева)
    static initTopAndLeftFieldItemNeighbour(currentItem, matrix, row, col) {
        currentItem.initNeighbours((col>0) ? matrix[row][col-1] : null,
            (row>0) ? matrix[row-1][col] : null,null,null);
    }

    constructor({settings}){
        Field.settings = settings;
        this.matrix = [];
        for(let i=0; i<Field.settings.fieldHeight; i++){
            let row = [];
            this.matrix.push(row);
            for(let j=0; j<Field.settings.fieldWidth;j++){
                let item = new FieldItem(Field.settings.colorsCount, Field.settings.minimalGroup);
                row.push(item);
                Field.initTopAndLeftFieldItemNeighbour(item, this.matrix, i, j);
            }
        }
        this.matrix.tryBurnItemAndGetScore = this.tryBurnItemAndGetScore;
        this.matrix.checkPairs = this.checkPairs;
        this.matrix.replaceAfterBurn = this.replaceAfterBurn;
        this.matrix.generateNewFieldItems = this.generateNewFieldItems;
        this.matrix.shakeField = this.shakeField;
        this.matrix.updateNeighbourRelations = this.updateNeighbourRelations;
        this.matrix.fieldHaveOccurrence = this.fieldHaveOccurrence;
        return this.matrix;
    }

    // Проверить, есть ли во всем игровом поле совпадения (для составления пар перемешиванием)
    fieldHaveOccurrence(){
        let allMatrix = [];
        for(let i=0; i<Field.settings.fieldHeight; i++){
            this[i].map(item => allMatrix.push(item.color));
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
                    const tempObject = this[i][j];
                    this[i][j] = this[i][k];
                    this[i][k] = tempObject;
                    this[i][j].hasSameNeighbour = false;
                    this[i][k].hasSameNeighbour = false;
                }
                // Позиция целой "строки" фишек\тайлов для перетасовывания
                let m = Math.floor(Math.random() * Field.settings.fieldHeight);
                if(m != i){
                    const tempObject = this[i];
                    this[i] = this[m];
                    this[m] = tempObject;
                }
            }
        }

        // Если вообще нет одинаковых цветов во всей матрице, создать "пару"
        if(!this.fieldHaveOccurrence()){
            try{
                this[0][1].color = this[0][0].color;
                this[0][0].hasSameNeighbour = true;
                this[0][1].hasSameNeighbour = true;
            }
            catch{
                console.log("Похоже, задано слишком маленькое игровое поле");
                return 0;
            }
        }

        // Обновить ссылки на соседей всех фишек поля
        this.updateNeighbourRelations();
    }

    // Попробовать "сжечь фишки" при активации ячейки
    tryBurnItemAndGetScore(row, col){
        if(this[row] === undefined 
            || this[row][col] === undefined || this[row][col].c =="_"){
            console.log("Такой клетки нет");
            return 0; // вернуть 0 очков
        }
        let scoreToAdd = this[row][col].fireItemReturnScore();
        return scoreToAdd; // вернуть 0 очков прибавки
    }
    
    // Сгенерировать сверху новые фишки после "сгоревших"
    // param "newItemsGenerationMask" массив-"маска" количества пустых тайлов в каждом столбце
    generateNewFieldItems(newItemsGenerationMask = []){
        if(!newItemsGenerationMask.length) return;
        let maxBurnedItemsColumn = Math.max(...newItemsGenerationMask);
        for(let i = 0; i< maxBurnedItemsColumn; i++){
            for(let j=0; j<Field.settings.fieldWidth; j++){
                if(i < newItemsGenerationMask[j]){
                    this[i][j] = new FieldItem(Field.settings.colorsCount, Field.settings.minimalGroup);
                }
            }
        }
        // Обновить ссылки на соседей всех фишек поля
        this.updateNeighbourRelations();
    }

    // Обновить ссылки на соседей всех фишек поля
    updateNeighbourRelations(){
        for(let i=0; i<Field.settings.fieldHeight; i++){
            for(let j=0; j<Field.settings.fieldWidth; j++){                
                Field.initTopAndLeftFieldItemNeighbour(this[i][j], this, i, j);
            }
        }
    }

    // Запустить механизм выпадения новых фишек и перемещения
    replaceAfterBurn(showBurnedTiles = false){
        // Подготовить массив счетчиков для генерации новых фишек
        let newItemsGenerationMask = [];
        for(let i=0; i<Field.settings.fieldWidth; i++) 
            newItemsGenerationMask.push(0);

        // Обойти игровое поле снизу вверх        
        for(let i=Field.settings.fieldHeight-1; i>=0; i--){
            for(let j=0; j<Field.settings.fieldWidth; j++){
                if(this[i][j].color == "_"){
                    // Попробовать сдвинуть на её место ближайшую фишку сверху
                    if(i-1>=0){
                        for(let k=i-1; k>=0; k--){                        
                            if(this[k][j].color != "_"){
                                const tempObject = this[i][j];
                                this[i][j] = this[k][j];
                                this[k][j] = tempObject;
                                this[k][j].hasSameNeighbour = false;
                                this[i][j].hasSameNeighbour = false;
                                break;
                            }
                        }
                    }
                }
            }
        }

        // Проинициализировать соседние фишки (связать соседей)
        for(let i=0; i<Field.settings.fieldHeight; i++){
            for(let j=0; j<Field.settings.fieldWidth; j++){                
                if(this[i][j].color == "_"){
                    // Если фишка при обходе снизу "сгоревшая" - прибавить счетчик необходимых к генерации фишек
                    newItemsGenerationMask[j]++;
                }
                // Обновить ссылки на соседей всех фишек поля
                Field.initTopAndLeftFieldItemNeighbour(this[i][j], this, i, j);
            }
        }
        // Показать если надо промежуточную матрицу с пустотами
        if(showBurnedTiles){
            let fieldMatrix = "";
            for(let i=0; i<Field.settings.fieldHeight; i++){
                for(let j=0; j<Field.settings.fieldWidth;j++){
                    fieldMatrix += `${this[i][j].color} \t`;
                }
                fieldMatrix += "\n";
            }
            console.log(fieldMatrix);
        }

        // Сгенерировать новые фишки
        this.generateNewFieldItems(newItemsGenerationMask);
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