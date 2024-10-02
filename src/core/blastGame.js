import { Settings } from './settings.js'
import { Field } from './field/field.js'
import { GameState } from './gameState.js'

export class BlastGame{    
    /**
    * Конструктор для создания Игры Бласт
    * @constructor
    * @param {number} n - Высота игрового поля
    * @param {number} m - Ширина игрового поля
    * @param {number} c - Количество цветов тайлов (не более 8)
    * @param {number} k=2 - Минимальный размер групп
    * @param {number} maxScore = 1000 - Число очков для победы
    * @param {number} stepsCounter = 10 - Максимальное число шагов на уровне
    * @param {number} s=3 - Количество "встрясок" на уровне
    * @param {number} boosterProbability = 50 - % выпадения бонуса-бустера
    * @param {number} bombRadius=2 - Радиус взрыва бустера-бомбы в тайлах
    * @param {number} largeGroupBonusRequirement=3 - Размер группы сжигаемой для выпадения супер-тайла
    * @param {number} largeGroupBonusEffect=1 - Тип эффекта активации супер-тайла
    * @param {function} tapTileHandler=()=>{} - Внешняя функция выбора позиции тайла на игровом поле
    * @param {Boolean} isWebUI=false - флаг для подключения с веб-клиента
    * @param {Boolean} singleLevel=true - флаг для игрой в единственный уровень
    */
    constructor({n, m, c, k = 2, maxScore = 1000, stepsCounter = 10,
                 s=3, boosterProbability = 50, bombRadius=4,
                 largeGroupBonusRequirement=3, largeGroupBonusEffect=0, 
                 tapTileHandler=()=>{}, isWebUI = false, singleLevel=true}){
        this.tapTileHandler = tapTileHandler;
        this.settings = new Settings({
            singleLevel: singleLevel,
            isWebUI: isWebUI,
            fieldHeight : n<2?2:n,
            fieldWidth : m<2?2:m,
            colorsCount : c>8?8:c,
            minimalGroup : k<2?2:k,
            maxScore : maxScore>1?maxScore:1,
            stepsCounter : stepsCounter>1? stepsCounter : 1,
            maxStepsCount: stepsCounter>1? stepsCounter : 1,
            shakesCount : s,
            boosterProbability :boosterProbability,
            bombRadius : bombRadius,
            largeGroupBonusRequirement : largeGroupBonusRequirement,
            largeGroupBonusEffect : largeGroupBonusEffect
        });
        this._stage = GameState.SETTINGS;
        this.activateTile.bind(this);
        this.replaceTilesAfterFire.bind(this);
        this.currentScore = 0;
        this.currentShakesCount = s;
        this.scoreAchieved = false;
        this.hasPairs = false;
        this.currentLevel = 1;
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
    replaceTilesAfterFire(showConsoleLog, fallCallback=()=>{}, genCallback=()=>{}){
        console.log("Смещаем фишки сверху!");
        this.field.replaceAfterBurn(false, fallCallback, genCallback);
        if(showConsoleLog) this.showFieldAndState();
    }

    // Вызвать "встряску" игрового поля
    shakeField(){
        if(this.currentShakesCount > 0){
            this.field.shakeField();
            this.currentShakesCount--;
            return 1;
        }
        return 0;
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

    showFieldAndState(prefixText = ""){
        console.log(prefixText);
        BlastGame.showField(this.field, this.settings);
        console.log("this.currentScore "+this.currentScore);
        if(this.currentScore >= this.settings.maxScore){
            this.stage = GameState.WIN;
            this.scoreAchieved = true;
            return this.stage;
        }
        else if(this.settings.stepsCounter == 0){
            this.stage = GameState.LOSE;
            return this.stage;
        }
        return 0;
    }

    // Активировать фишку в ячейке игрового поля
    async activateTile(
        row, col, 
        clientCallbackFunction = ()=>{}, 
        stepsCalcFreeze = false, 
        burnAnimationCallback = ()=>{}, 
        fallAnimationCallback = ()=>{},
        genAnimationCallback = ()=>{},
        refreshAllField = ()=>{},
        showResultPopup = ()=>{}){
        
        this.field.burnAnimationCallback = burnAnimationCallback;
        this.field.fallAnimationCallback = fallAnimationCallback;
        this.field.genAnimationCallback = genAnimationCallback;
        this.refreshAllField = refreshAllField;

        let clientResult = false; 
        // если row и col undefined и stepsCounter не надо убавлять
        if((undefined == (row && col)) ?? true){
            clientResult= true;
        }
        else if(this.settings.stepsCounter){
            // Прибавить счет, если фишки сгорят
            const newScoreToAdd = await this.field.activateTileAndGetScore(row, col, "", this, burnAnimationCallback);
            if(newScoreToAdd.then != undefined){
                console.log("TELEPORT");
                clientResult= false;
            }
            else if(newScoreToAdd){
                this.currentScore += newScoreToAdd;
                let showConsoleLog = false;
                this.replaceTilesAfterFire(showConsoleLog, fallAnimationCallback, genAnimationCallback);
            }
            // Вычесть шаг, если калькуляция шагов не заморожена (как при телепорте)
            if(!stepsCalcFreeze) this.settings.stepsCounter--;
            clientResult= true;
        }
        
        // Вызов Колбека при работе с UI
        setTimeout(()=>{
            this.refreshAllField();
        }, 500);

        // Вызов колбека при работе с Консолью
        clientCallbackFunction(this);
        console.log("this.currentScore: "+this.currentScore);
        console.log("this.stepsCount: "+this.settings.stepsCounter);
        if(this.currentScore >= this.settings.maxScore){
            const needRestart = false;
            const resultName = "ПОБЕДА!";
            const resultLevelText = `Уровень ${this.currentLevel} пройден`;
            const resultScoreText = `${this.currentScore}/${this.settings.maxScore} очков`;
            const resultButtonText = "Далее";           
            showResultPopup(needRestart, resultName, resultLevelText, resultScoreText, resultButtonText);
        }
        else if(this.settings.stepsCounter == 0){
            const needRestart = true;
            const resultName = "ПОРАЖЕНИЕ :(";
            const resultLevelText = "0 шагов осталось";
            const resultScoreText = `${this.currentScore}/${this.settings.maxScore} очков`;
            const resultButtonText = "Переиграть";
            showResultPopup(needRestart, resultName, resultLevelText, resultScoreText, resultButtonText);
        }
        return clientResult;
    }

    startAnotherLevel(repeat = true){
        this.currentScore = 0;
        this.hasPairs = false;
        if(!repeat){
            this.settings.maxStepsCount += 1;
            this.currentLevel += 1;
            this.settings.maxScore += 50;
            if(this.currentLevel%5==0){
                this.settings.shakesCount += 1;
                if(this.settings.fieldWidth < 11) this.settings.fieldWidth += 1;
            }
            if(this.currentLevel%6 == 0 && this.settings.fieldHeight<11){
                this.settings.fieldHeight += 1;
            }
        }
        this.currentShakesCount = this.settings.shakesCount;
        this.settings.stepsCounter = this.settings.maxStepsCount;
        this.createField();
        this.refreshAllField();
    }
}
