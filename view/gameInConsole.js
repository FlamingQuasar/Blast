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
const game = new BlastGame({n:3, m:3, c:9, k:2, maxScore:100, stepsCounter:3});
let {row, column} = {};
// спросить в консоли - Настроить игру? y / n
// задать через запятую высоту n, ширину m, количество цветов c, счет для победы, доступно шагов, доступно встрясок
do{
    console.log(`Шагов осталось: ${game.settings.stepsCounter} (Счёт ${game.currentScore}/${game.settings.maxScore}) - группы не менее ${game.settings.minimalGroup} фишек`);
    game.showField();
    if(game.settings.stepsCounter && !game.scoreAchieved){
        const answer = await rl.question('Введите ряд и столбец Тайла через запятую (Или букву S - Shake):');
        let splitedAnswer = answer.split(",");
        if(splitedAnswer.length==1 && splitedAnswer[0] == "s"){
            game.shakeField();
            row = column = undefined;
            continue;
        } else
            ({row, column} = { row: +splitedAnswer[0], column: +splitedAnswer[1]});
    }
} while(game.activateFieldItem(row, column) == true);

rl.close();

