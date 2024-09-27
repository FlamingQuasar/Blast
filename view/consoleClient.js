import { BlastGame } from '../src/core/blastGame.js'
import * as readline from 'node:readline/promises';
import {
   stdin as input,
   stdout as output
} from 'node:process';

let game = {};
const showQuestionGetInput = async function(questionText = ""){
    const readLine = readline.createInterface({
        input,
        output
     });
    const answer = await readLine.question(questionText);
    readLine.close();
    return answer.split(",");
};

const setupAnswer = await showQuestionGetInput('Настроить игровые параметры? (y / n)');
// Настройка игры через консоль
if(setupAnswer[0] == "y"){
    const params = await showQuestionGetInput('Задайте через \",\" Высоту(n), Ширину(m), Число цветов(c), Число очков для победы, Доступно шагов, Доступно перемешиваний:\n');
    //const params = setupParamsAnswer.split(',');
    
    // Значения настроек бустеров по умолчанию
    let bustersSettings = {
        boosterProbability : 50,
        bombRadius : 2,
        largeGroupBonusRequirement : 3,
        largeGroupBonusEffect: 1
    };
    const bustersSetupAnswer = await showQuestionGetInput('Настроить бустеры? (y / n)');
    if(bustersSetupAnswer == "y"){
        const bustersParams = await showQuestionGetInput(`Задайте через \",\" (0-100)% генерации бустера после сжигания, Радиус бомбы(R), Размер группы для супер-тайла (L), Вариант логики супер-тайла (1-4)
        (1 - сжигает строку, 2 - сжигает столбец, 3 - сжигает радиус R, 4 - сжигает игровое поле)\n`);
        bustersSettings = {
            boosterProbability : +bustersParams[0],
            bombRadius : +bustersParams[1],
            largeGroupBonusRequirement : +bustersParams[2],
            largeGroupBonusEffect: +bustersParams[3]
        };
    }
    game = new BlastGame({ 
        tapTileHandler: showQuestionGetInput,
        n: +params[0], // высота поля
        m: +params[1], // ширина поля
        c: +params[2], // число цветов
        k:2, 
        maxScore: +params[3], // число очков для победы на уровне
        stepsCounter: +params[4], // доступно шагов на уровне
        s : +params[5], // доступно перемешиваний на уровне
        boosterProbability: bustersSettings.boosterProbability,// % выпадения бонуса-бустера
        bombRadius: bustersSettings.bombRadius,//- Радиус взрыва бустера-бомбы в тайлах
        largeGroupBonusRequirement: bustersSettings.largeGroupBonusRequirement, // - Размер группы сжигаемой для выпадения супер-тайла
        largeGroupBonusEffect: bustersSettings.largeGroupBonusEffect // - Тип эффекта активации супер-тайла
    });
}
else{
    game = new BlastGame({n:5, m:6, c:9, k:2, maxScore:100, stepsCounter:3, s:3,
        tapTileHandler: showQuestionGetInput });
}

let {row, column} = {};
// Основной цикл
do{
    //console.clear();
    console.log(`Осталось (Шагов:${game.settings.stepsCounter}, Встрясок:${game.settings.shakesCount}) (Счёт ${game.currentScore}/${game.settings.maxScore}) - группы не менее ${game.settings.minimalGroup} фишек`);
    game.showFieldAndState();
    if(game.settings.stepsCounter){
        // TODO добавить концовку при окончании числа ходов
    }
    if(game.settings.stepsCounter && !game.scoreAchieved){
        let splitedAnswer = await showQuestionGetInput(
            'Введите ряд и столбец Тайла через запятую (Или букву S - Shake):'
        );
        if(splitedAnswer.length == 1 && splitedAnswer[0] == "s"){
            game.shakeField();
            row = column = undefined;
            continue;
        } else
            ({row, column} = { row: +splitedAnswer[0], column: +splitedAnswer[1]});
    }
} while(await game.activateFieldItem(row, column) == true);


