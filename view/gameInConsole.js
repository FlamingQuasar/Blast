import { BlastGame } from '../src/core/blastGame.js'
import * as readline from 'node:readline/promises';
import {
   stdin as input,
   stdout as output
} from 'node:process';

const rl = readline.createInterface({
   input,
   output
});
const game = new BlastGame({n:5, m:10, c:6, k:2, maxScore:100, stepsCounter:3});
let {row, column} = {};

do{
    console.log(`Шагов осталось: ${game.settings.stepsCounter} (Счёт ${game.currentScore}/${game.settings.maxScore}) - группы не менее ${game.settings.minimalGroup} фишек`);
    game.showField();
    if(game.settings.stepsCounter && !game.scoreAchieved){
        const answer = await rl.question('Введите ряд и столбец Фишки через запятую:');
        let splitedAnswer = answer.split(",");
        ({row, column} = { row: +splitedAnswer[0], column: +splitedAnswer[1]});
    }
} while(game.activateFieldItem(row, column) == true);

rl.close();

