import { Settings } from './settings.js'
import { Field } from './field.js'

export class BlastGame{
    
    constructor({n, m, c, k=2, maxScore=1000, stepsCounter=10}){  
        this.settings = new Settings({
            fieldHeight : n,
            fieldWidth : m,
            colorsCount : c,
            minimalGroup : k<2?2:k,
            maxScore : maxScore>1?maxScore:1,
            stepsCounter : stepsCounter>1? stepsCounter : 1
        });
        this.activateFieldItem.bind(this);
        this.replaceItemsAfterFire.bind(this);
        this.currentScore = 0;
        this.scoreAchieved = false;
        this.hasPairs = false;
        this.createField();
    }

    // Сместить фишки сверху вниз после сгорания группы или сгенерировать
    replaceItemsAfterFire(){
        console.log("replacing!");
        this.field.runReplacingAfterBurn();
        this.showField();
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
        if(this.currentScore >= this.settings.maxScore){
            console.log("Победа!");
            this.scoreAchieved = true;
        }
        else if(this.stepsCounter == 0){
            console.log("Поражение!");
        }
    }

    // Активировать фишку в ячейке игрового поля
    activateFieldItem(row, col){
        if(this.settings.stepsCounter){
            // Прибавить счет, если фишки сгорят
            const newScoreToAdd = this.field.tryBurnItemAndGetScore(row,col);            
            if(newScoreToAdd){
                this.currentScore += newScoreToAdd;
                this.replaceItemsAfterFire();
            }
            this.settings.stepsCounter--;
            return true;
        }
        return false;
    }
}