import { Settings } from './settings.js'
import { Field } from './field.js'

export class BlastGame{
    
    constructor({n, m, c, k=2, maxScore=1000, maxSteps=10}){  
        this.settings = new Settings({
            fieldHeight : n,
            fieldWidth : m,
            colorsCount : c,
            minimalGroup : k<2?2:k,
            maxScore : maxScore>1?maxScore:1,
            maxSteps : maxSteps>1?maxSteps:1
        });
        this.currentScore = 0;
        this.hasPairs = false;
        this.createField();
    }

    replaceItemsAfterFire(){
        //type 1 : появляются сразу на местах

        //type 2 : смещаются снизу вверх и генерятся сверху
    }

    createField(){
        if(this.settings.fieldHeight && this.settings.fieldWidth){
            this.field = new Field({settings: this.settings});
            this.hasPairs = this.checkFieldHasPairs();
        }
    }

    checkFieldHasPairs(){
        return this.field.checkPairs();
    }

    showField({onlyPairs = false}={}){
        let fieldMatrix = "";
        for(let i=0; i<this.settings.fieldHeight; i++){
            for(let j=0; j<this.settings.fieldWidth;j++){
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

    activateFieldItem(row, col){
        this.field.activateFieldItem(row,col);
    }
}