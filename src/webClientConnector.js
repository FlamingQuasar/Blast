import { BlastGame } from "./core/blastGame.js";


addEventListener("DOMContentLoaded",function(){
    if(window != undefined){
        const game = new BlastGame({n:6, m:6, c:9, k:2, maxScore:250, stepsCounter:5, s:5,
            boosterProbability: 100, bombRadius:3, largeGroupBonusRequirement:3,
            largeGroupBonusEffect:0,
            tapTileHandler: ()=>{} });

        const showField = function(){            
            BlastGame.showField(game.field, game.settings);
            return game.field;
        };

        const gameShakeField = function(){
            return game.shakeField();
        }

        const getShakesCount = function(){
            return game.settings.shakesCount;
        }

        const getStepsCount = function(){
            return game.settings.stepsCounter+1;
        }

        const getScoreCount = function(){
            return game.currentScore;
        }
        
        const getMaxScore = function(){
            return game.settings.maxScore;
        }

        window.showField = showField;
        window.getShakesCount = getShakesCount;
        window.getStepsCount = getStepsCount;
        window.getScoreCount = getScoreCount;
        window.getMaxScore = getMaxScore;
        window.shakeField = gameShakeField;
        window.tapTile = ()=>{};
        window.requestStatus = ()=>{};

    }
});