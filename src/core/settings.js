export class Settings{
    /* Класс настроек реализован как синглтон */
    constructor({
        fieldHeight,
        fieldWidth,
        colorsCount,
        minimalGroup,
        maxScore,
        stepsCounter
    }){
        if (!Settings._instance) Settings._instance = this;
                
        Settings._instance.fieldHeight = fieldHeight;
        Settings._instance.fieldWidth = fieldWidth;
        Settings._instance.colorsCount = colorsCount;
        Settings._instance.minimalGroup = minimalGroup;
        Settings._instance.maxScore = maxScore;
        Settings._instance.stepsCounter = stepsCounter;
        return Settings._instance;
    }
}