import { Settings } from './settings.js'
import { Field } from './field.js'
import { GameState } from './gameState.js'

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
        this.stage = GameState.SETTINGS;
        this.activateFieldItem.bind(this);
        this.replaceItemsAfterFire.bind(this);
        this.currentScore = 0;
        this.scoreAchieved = false;
        this.hasPairs = false;
        this.createField();
    }

    // Сместить фишки сверху вниз после сгорания группы или сгенерировать
    replaceItemsAfterFire(){
        console.log("Смещаем фишки сверху!");
        this.field.replaceAfterBurn();
        this.showField();
    }

    createField(showConsoleLog = false){
        if(this.settings.fieldHeight && this.settings.fieldWidth){
            this.field = new Field({settings: this.settings});
            if(showConsoleLog) this.showField();
            this.hasPairs = this.checkFieldHasPairs();
            
            while(this.hasPairs == false){
                if(this.field.shakeField() === 0) break;
                this.hasPairs = this.checkFieldHasPairs();
                if(this.hasPairs) console.log("Потрясли поле и нашли пары!");
            }
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
        // заменить console log на возврат матрицы и смену(!а не возврат) игры
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