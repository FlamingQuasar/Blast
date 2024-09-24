export class Settings{
    /* Класс настроек реализован как синглтон */
    constructor({
        fieldHeight,
        fieldWidth,
        colorsCount,
        minimalGroup
    }){
        this.fieldHeight = fieldHeight;
        this.fieldWidth = fieldWidth;
        this.colorsCount = colorsCount;
        this.minimalGroup = minimalGroup;

        if (!Settings._instance) {
            Settings._instance = this;
          }
          return Settings._instance;
    }
}