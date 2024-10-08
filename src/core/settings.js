export class Settings{
    /* Класс настроек реализован как синглтон */
    constructor({
        singleLevel,
        isWebUI,
        fieldHeight,
        fieldWidth,
        colorsCount,
        minimalGroup,
        maxScore,
        stepsCounter,
        maxStepsCount,
        shakesCount,
        boosterProbability,
        bombRadius,
        largeGroupBonusRequirement,
        largeGroupBonusEffect
    }){
        if (!Settings._instance) Settings._instance = this;
        Object.keys(arguments[0]).map(
            arg => Settings._instance[arg] = arguments[0][arg]
        );
        return Settings._instance;
    }
}