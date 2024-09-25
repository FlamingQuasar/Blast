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
        this.matrix.runReplacingAfterBurn = this.runReplacingAfterBurn;
        return this.matrix;
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

    // Запустить механизм выпадения новых фишек и перемещения
    runReplacingAfterBurn(){

        function switchFieldItems(firstItem, secondItem){
            const tempObject = firstItem;
            firstItem = secondItem;
            secondItem = tempObject;
        }

        // Подготовить массив счетчиков для генерации новых фишек
        let newItemsGenerationCounter = [];
        for(let i=0; i<Field.settings.fieldWidth; i++) 
            newItemsGenerationCounter.push(0);

        // Обойти игровое поле снизу вверх        
        for(let i=Field.settings.fieldHeight-1; i>=0; i--){
            for(let j=0; j<Field.settings.fieldWidth; j++){
                if(this[i][j].color == "_"){
                    // Если фишка при обходе снизу "сгоревшая" - прибавить счетчик необходимых к генерации фишек
                    newItemsGenerationCounter[j]++;
                    // Попробовать сдвинуть на её место ближайшую фишку сверху
                    if(i-1>=0) for(let k=i-1; k>=0; k--){                        
                        if(this[k][j].color != "_"){
                            switchFieldItems();
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
                Field.initTopAndLeftFieldItemNeighbour(this[i][j], this, i, j);
            }
        }
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