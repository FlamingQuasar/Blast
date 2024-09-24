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
                let item = new FieldItem(Field.settings.colorsCount);
                row.push(item);
                item.initNeighbours((j>0)?this.matrix[i][j-1]:null,
                    (i>0)?this.matrix[i-1][j]:null,null,null);
            }
        }
        this.matrix.activateFieldItem = this.activateFieldItem;
        this.matrix.checkPairs = this.checkPairs;
        return this.matrix;
    }

    activateFieldItem(row, col){
        if(this[row] === undefined 
            || this[row][col] === undefined || this[row][col].c =="_"){
            console.log("Такой клетки нет");
            return;
        }
        this[row][col].fireItem();
    }

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