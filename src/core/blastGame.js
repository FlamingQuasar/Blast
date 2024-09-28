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
            boosterProbability :boosterProbability,
            bombRadius : bombRadius,
            largeGroupBonusRequirement : largeGroupBonusRequirement,
            largeGroupBonusEffect : largeGroupBonusEffect
        });
        this._stage = GameState.SETTINGS;
        this.activateFieldItem.bind(this);
        this.replaceItemsAfterFire.bind(this);
        this.currentScore = 0;
        this.scoreAchieved = false;
        this.hasPairs = false;
        this.createField();
    }
    get stage(){
        return this._stage;
    }
    set stage(value){
        this._stage = value;
        console.log(value.toString());
    }

    static showField(matrix, settings, onlyPairs=false){
        let fieldMatrix = "\n";
        for(let i=0; i<settings.fieldHeight; i++){
            for(let j=0; j<settings.fieldWidth;j++){
                if(onlyPairs){
                    fieldMatrix += `${matrix[i][j].hasSameNeighbour? matrix[i][j].tileType:"."} \t`;
                }
                else{
                    fieldMatrix += `${matrix[i][j].tileType} \t`;
                }
            }
            fieldMatrix += "\n";
        }
        fieldMatrix += "\n";
        // заменить console log на возврат матрицы и смену(!а не возврат) игры
        console.log(fieldMatrix);
    }

    // Сместить фишки сверху вниз после сгорания группы или сгенерировать
    replaceItemsAfterFire(showConsoleLog){
        console.log("Смещаем фишки сверху!");
        this.field.replaceAfterBurn();
        if(showConsoleLog) this.showFieldAndState();
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
            if(showConsoleLog) this.showFieldAndState();
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

    showFieldAndState({onlyPairs = false}={}){
        BlastGame.showField(this.field, this.settings);
        if(this.currentScore >= this.settings.maxScore){
            this.stage = GameState.WIN;
            console.log("Победа!");
            this.scoreAchieved = true;
        }
        else if(this.stepsCounter == 0){
            this.stage = GameState.LOSE;
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
            // Вычесть шаг, если калькуляция шагов не заморожена (как при телепорте)
            if(!stepsCalcFreeze) this.settings.stepsCounter--;
            return true;
        }
        return false;
    }
}