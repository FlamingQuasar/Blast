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
        this.fieldHeight = fieldHeight;
        this.fieldWidth = fieldWidth;
        this.colorsCount = colorsCount;
        this.minimalGroup = minimalGroup;
        this.maxScore = maxScore;
        this.stepsCounter = stepsCounter;

        if (!Settings._instance) {
            Settings._instance = this;
          }
          return Settings._instance;
    }
}