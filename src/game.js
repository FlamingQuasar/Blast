import { BlastGame } from './core/blastGame.js'
import * as readline from 'node:readline/promises';
import {
   stdin as input,
   stdout as output
} from 'node:process';

const rl = readline.createInterface({
   input,
   output
});
const game = new BlastGame({n:5, m:10, c:6});
do{
    game.showField();
    const answer = await rl.question('Введите ряд и столбец для клика через запятую:');
    let splitedAnswer = answer.split(",");
    let {row, column} = { row: +splitedAnswer[0], column: +splitedAnswer[1]};
    game.clickFieldItem(row, column);
    game.showField();
} while(game.checkFieldHasPairs());
rl.close();

