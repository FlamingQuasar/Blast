import { FieldItem } from './fieldItem.js'

export class BlastGame{
    constructor({n, m, c, k=2}){
       this.fieldHeight = n;
       this.fieldWidth = m;
       this.colorsCount = c;
       this.minimalGroup = k<2?2:k;
       this.hasPairs = false;
       if(n && m){
            this.createField();
            this.checkField();
       }
    }

    replaceItemsAfterFire(){
        //type 1 : появляются сразу на местах

        //type 2 : смещаются снизу вверх и генерятся сверху
    }

    createField(){
        this.field=[];
        for(let i=0; i<this.fieldHeight; i++){
            let row = [];
            this.field.push(row);
            for(let j=0; j<this.fieldWidth;j++){
                let item = new FieldItem(this.colorsCount);
                row.push(item);
                item.initNeighbours((j>0)?this.field[i][j-1]:null,
                    (i>0)?this.field[i-1][j]:null,null,null);
            }
        }
        //console.log(this.field);
    }

    checkField(){
        this.hasPairs = false;
        outer:
        for(let i=0; i<this.fieldHeight; i++){
            for(let j=0; j<this.fieldWidth;j++){
                this.hasPairs = this.field[i][j].hasSameNeighbour;
                if(this.hasPairs) break outer;
            }
        }
        //console.log(this.hasPairs);
    }

    showField({onlyPairs = false}={}){
        let fieldMatrix = "";
        for(let i=0; i<this.fieldHeight; i++){
            for(let j=0; j<this.fieldWidth;j++){
                if(onlyPairs){
                    fieldMatrix += `${this.field[i][j].hasSameNeighbour? this.field[i][j].color:"."} \t`;
                }
                else{
                    fieldMatrix += `${this.field[i][j].color} \t`;
                }
            }
            fieldMatrix += "\n";
        }
        console.log(fieldMatrix);
    }

    clickFieldItem(row, col){
        if(this.field[row] === undefined 
            || this.field[row][col] === undefined){
            console.log("Такой клетки нет");
            return;
        }
        this.field[row][col].fireItem();
        this.showField();
    }
}