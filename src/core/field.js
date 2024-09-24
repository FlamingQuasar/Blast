import { FieldItem } from './fieldItem.js'

// Класс "игровое поле" ведёт себя как массив с добавлением методов
export class Field{

    static settings = {};

    constructor({settings}){
        Field.settings = settings;
        this.matrix = [];
        for(let i=0; i<Field.settings.fieldHeight; i++){
            let row = [];
            this.matrix.push(row);
            for(let j=0; j<Field.settings.fieldWidth;j++){
                let item = new FieldItem(Field.settings.colorsCount, Field.settings.minimalGroup);
                row.push(item);
                item.initNeighbours((j>0)?this.matrix[i][j-1]:null,
                    (i>0)?this.matrix[i-1][j]:null,null,null);
            }
        }
        this.matrix.tryBurnItemAndGetScore = this.tryBurnItemAndGetScore;
        this.matrix.checkPairs = this.checkPairs;
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