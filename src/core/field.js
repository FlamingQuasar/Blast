import { FieldItem } from './fieldItem.js'

export class Field{

    constructor({settings}){
        this.settings = settings;
        this.matrix = [];
        for(let i=0; i<this.settings.fieldHeight; i++){
            let row = [];
            this.matrix.push(row);
            for(let j=0; j<this.settings.fieldWidth;j++){
                let item = new FieldItem(this.settings.colorsCount);
                row.push(item);
                item.initNeighbours((j>0)?this.matrix[i][j-1]:null,
                    (i>0)?this.matrix[i-1][j]:null,null,null);
            }
        }
        return this.matrix;
    }
}