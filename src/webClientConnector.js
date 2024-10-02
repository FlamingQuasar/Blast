import { BlastGame } from "./core/blastGame.js";


addEventListener("DOMContentLoaded",function(){
    if(window != undefined){
        let game = null;
        
        const createNewGame = function(
            n, m, c, maxScore, stepsCounter, s,
            boosterProbability, bombRadius, largeGroupBonusRequirement,
            largeGroupBonusEffect,
            tapTileForTeleport=()=>{}
        ){
            game = new BlastGame({n:n, m:m, c:c, k:2, maxScore:maxScore, stepsCounter:stepsCounter, s:s,
                boosterProbability: boosterProbability, bombRadius:bombRadius, 
                largeGroupBonusRequirement:largeGroupBonusRequirement, largeGroupBonusEffect:largeGroupBonusEffect,
                tapTileHandler: tapTileForTeleport,
                isWebUI: true,
                singleLevel: false });
        }

        const showField = function(){            
            BlastGame.showField(game.field, game.settings);
            return game.field;
        }

        const gameShakeField = function(){
            return game.shakeField();
        }

        const getShakesCount = function(){
            return game.currentShakesCount;
        }

        const getStepsCount = function(){
            return game.settings.stepsCounter;
        }

        const getScoreCount = function(){
            return game.currentScore;
        }
        
        const getMaxScore = function(){
            return game.settings.maxScore;
        }

        const anotherLevelInit = function(repeat = true){
            game.startAnotherLevel(repeat);
        }

        const getCurrentLevel = function(){
            return game.currentLevel;
        }

        const getSettings = function(){
            return game.settings;
        }

        const gameTapTile = async function(
                row, column, 
                burnAnimation=()=>{}, 
                fallAnimation = ()=>{}, 
                generateAnimation=()=>{},
                refreshAllField=()=>{},
                showResultPopup=()=>{}){
            return await game.activateTile(row, column, ()=>{}, false, burnAnimation, 
                fallAnimation, generateAnimation, refreshAllField, showResultPopup);
        }

        window.showField = showField;
        window.getShakesCount = getShakesCount;
        window.getStepsCount = getStepsCount;
        window.getScoreCount = getScoreCount;
        window.getMaxScore = getMaxScore;
        window.shakeField = gameShakeField;
        window.tapTile = gameTapTile;
        window.createNewGame = createNewGame;
        window.requestStatus = ()=>{};
        window.anotherLevelInitRequest = anotherLevelInit;
        window.getCurrentLevel = getCurrentLevel;
        window.getSettings = getSettings;
    }
});