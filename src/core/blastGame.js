import { Settings } from './settings.js'
import { Field } from './field/field.js'
import { GameState } from './gameState.js'

export class BlastGame{    
    /**
    * Конструктор для создания Игры Бласт
    * @constructor
    * @param {number} n - Высота игрового поля
    * @param {number} m - Ширина игрового поля
    * @param {number} c - Количество цветов тайлов (фишек)
    * @param {number} k=2 - Минимальный размер групп
    * @param {number} maxScore = 1000 - Число очков для победы
    * @param {number} stepsCounter = 10 - Максимальное число шагов на уровне
    * @param {number} s=3 - Количество "встрясок" на уровне
    * @param {number} boosterProbability = 50 - % выпадения бонуса-бустера
    * @param {number} bombRadius=2 - Радиус взрыва бустера-бомбы в тайлах
    * @param {number} largeGroupBonusRequirement=3 - Размер группы сжигаемой для выпадения супер-тайла
    * @param {number} largeGroupBonusEffect=1 - Тип эффекта активации супер-тайла
    * @param {function} tapTileHandler=()=>{} - Внешняя функция выбора позиции тайла на игровом поле
    */
    constructor({n, m, c, k = 2, maxScore = 1000, stepsCounter = 10,
                 s=3, boosterProbability = 50, bombRadius=2,
                 largeGroupBonusRequirement=3, largeGroupBonusEffect=1, 
                 tapTileHandler=()=>{}}){
        this.tapTileHandler = tapTileHandler;
        this.settings = new Settings({
            fieldHeight : n<2?2:n,
            fieldWidth : m<2?2:m,
            colorsCount : c,
            minimalGroup : k<2?2:k,
            maxScore : maxScore>1?maxScore:1,
            stepsCounter : stepsCounter>1? stepsCounter : 1,
            shakesCount : s,
            boosterProbability,
            bombRadius,
            largeGroupBonusRequirement,
            largeGroupBonusEffect
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
    replaceItemsAfterFire(showConsoleLog){
        console.log("Смещаем фишки сверху!");
        this.field.replaceAfterBurn();
        if(showConsoleLog) this.showField();
    }

    // Вызвать "встряску" игрового поля
    shakeField(){
        if(this.settings.shakesCount > 0){
            this.field.shakeField();
            this.settings.shakesCount--;
        }
    }

    createField(showConsoleLog = false){
        if(this.settings.fieldHeight && this.settings.fieldWidth){
            this.stage = GameState.GENERATE;
            this.field = new Field({settings: this.settings, tapTileHandler:this.tapTileHandler});
            if(showConsoleLog) this.showField();
            this.hasPairs = this.checkFieldHasPairs();
            
            while(this.hasPairs == false){
                if(this.field.shakeField() === 0) break;
                this.hasPairs = this.checkFieldHasPairs();
                if(this.hasPairs) console.log("Потрясли поле и нашли пары!");
            }
            this.stage = GameState.START;
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
                    fieldMatrix += `${this.field[i][j].hasSameNeighbour? this.field[i][j].tileType:"."} \t`;
                }
                else{
                    fieldMatrix += `${this.field[i][j].tileType} \t`;
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
    async activateFieldItem(row, col, showConsoleLog = false, stepsCalcFreeze=false){
        // если row и col undefined и stepsCounter не надо убавлять        
        if((undefined == (row && col)) ?? true){
            return true;
        }
        if(this.settings.stepsCounter){
            // Прибавить счет, если фишки сгорят
            const newScoreToAdd = await this.field.activateTileAndGetScore(row,col);
            if(newScoreToAdd.then != undefined){
                return false;
            }
            if(newScoreToAdd){
                this.currentScore += newScoreToAdd;
                this.replaceItemsAfterFire(showConsoleLog);
            }
            // Вычесть шаг, если калькуляция шагов не заморожена
            if(!stepsCalcFreeze) this.settings.stepsCounter--;
            return true;
        }
        return false;
    }
}