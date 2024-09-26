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
let game = {};
let {row, column} = {};
const setupAnswer = await rl.question('Настроить игровые параметры? (y / n)');
// Настройка игры через консоль
if(setupAnswer == "y"){
    const setupParamsAnswer = await rl.question('Задайте через \",\" Высоту(n), Ширину(m), Число цветов(c), Число очков для победы, Доступно шагов, Доступно перемешиваний:\n');
    const params = setupParamsAnswer.split[','];
    const bustersSetupAnswer = await rl.question('Настроить бустеры? (y / n)');
    if(bustersSetupAnswer == "y"){
        const bustersParamsAnswer = await rl.question(`Задайте через \",\" Радиус бомбы(R), Размер группы для супер-тайла (L), Вариант логики супер-тайла (1-4)
        (1 - сжигает строку, 2 - сжигает столбец, 3 - сжигает радиус R, 4 - сжигает игровое поле)\n`);
    }
    const bustersSettings = {
        r : +bustersParams[0],
        l : +bustersParams[1],
        superTileLogicVariant : +bustersParams[2]
    };
    game = new BlastGame({ 
        n: +params[0], m: +params[1], 
        c: +params[2], k:2, maxScore: +params[3], 
        stepsCounter: +params[4],
        s : +params[5],
        bustersSettings : bustersSettings
    });
}
else{
    game = new BlastGame({n:3, m:3, c:9, k:2, maxScore:100, stepsCounter:3, s:3});
}

// Основной цикл
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

