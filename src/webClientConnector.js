import { BlastGame } from "./core/blastGame.js";


addEventListener("DOMContentLoaded",function(){
    if(window != undefined){
        const game = new BlastGame({n:6, m:6, c:9, k:2, maxScore:250, stepsCounter:5, s:5,
            boosterProbability: 100, bombRadius:3, largeGroupBonusRequirement:3,
            largeGroupBonusEffect:0,
            tapTileHandler: ()=>{} });

        const myFuncIsGlodal = function(){            
            BlastGame.showField(game.field, game.settings);
            if(typeof alert == "function") this.alert("!!!")
            return game.field;
        };

        const gameShakeField = function(){
            game.shakeField();
            BlastGame.showField(game.field, game.settings);
            return game.field;
        }

        window.startFunc = myFuncIsGlodal;
        window.shakeField = gameShakeField;
        window.tapTile = ()=>{};
        window.requestStatus = ()=>{};
    }
});