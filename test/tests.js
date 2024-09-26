import { BlastGame } from '../src/core/blastGame.js'
import { Field } from '../src/core/field/field.js'
import { expect } from "chai"

describe('BlastGame class', function () {
    before(()=>console.log("Начало тестирования: импортировали BlastGame из модуля"));
    after(()=>console.log("Тестирование BlastGame пройдено"));

    for(let i=2, j=2; j<10 && i<10; i++, j++){
        const height = Math.floor(Math.random() * i) + 1;
        const width = Math.floor(Math.random() * j) + 1;
        describe(`Конструктор BlastGame создает игровое поле нужной высоты [${height} на ${width}]`, function(){
            let game = new BlastGame({n:height, m:width, c:6});
            if(height<2){
                it(`new BlastGame создает поле высоты 2, а не [${height}], так как 2 - минимальное значение`, function(){                
                    expect(game.field.length).to.equal(2);
                });
            }
            else{
                it(`new BlastGame создает поле высоты [${height}]`, function(){                
                    expect(game.field.length).to.equal(height);
                });
            }
            if(width<2){
                it(`new BlastGame создает поле ширины 2, а не [${width}], так как 2 - минимальное значение`, function(){                
                    expect(game.field[0].length).to.equal(2);
                });
            } else {
                it(`new BlastGame создает поле ширины [${width}]`, function(){
                    expect(game.field[0].length).to.equal(width);
                });
            }
        });
    }
    describe('static Field.isEmptySettings()', function(){
        it('Field.settings пусты, вернет "true"', function(){
            expect(Field.isEmptySettings({})).to.equal(true);
        })
        it('Field.settings заданы, вернет "false"', function(){
            let game = new BlastGame({n:5, m:10, c:6});
            expect(Field.isEmptySettings()).to.equal(false);
        })
    });
    describe('field.fieldHaveOccurrence()', function(){
        it('field.fieldHaveOccurrence - метод находит повтор элемента в игровом поле', function(){
            const game = new BlastGame({n:5, m:10, c:6});
            game.field[0][1].c = game.field[0][0].c;
            expect(game.field.fieldHaveOccurrence()).to.equal(true);
        });
    });
    describe('field.getTileOnPosition([row, col])', function(){
        it('field.getTileOnPosition([row, col]) возвращает null в случае когда в данной позиции ничего нет',function(){
            const game = new BlastGame({n:5, m:10, c:6});
            expect(game.field.getTileOnPosition([100, 100])).to.equal(null);
        });        
        it('field.getTileOnPosition([row, col]) возвращает Tile когда в данной позиции есть Фишка(тайл)',function(){
            const game = new BlastGame({n:5, m:10, c:6});
            expect(game.field.getTileOnPosition([0, 0])).to.equal(game.field[0][0]);
        });
    });
    
    describe('Field.swap', function(){
        it('Field.swap меняет местами значения двух примитивов number', function(){
            let firstNumber = 1;
            let secondNumber = 2;
            [firstNumber, secondNumber] = Field.swap(firstNumber, secondNumber);
            expect(firstNumber).to.equal(2);
            expect(secondNumber).to.equal(1);
        });
        it('Field.swap меняет местами значения двух объектов {x:number}', function(){
            let firstNumber = {x:1};
            let secondNumber = {x:2};
            [firstNumber, secondNumber] = Field.swap(firstNumber, secondNumber);
            expect(firstNumber.x).to.equal(2);
            expect(secondNumber.x).to.equal(1);
        });
    });
    
    describe('field.checkIfFieldHaveTile', function(){
       it('checkIfFieldHaveTile(booster) возвращает true когда находит тайл среди игрового поля', function(){
            let game = new BlastGame({n:5, m:10, c:6});
            let tile = game.field.getTileOnPosition([0,0]);
            tile.tileType = "x";
            expect(game.field.checkIfFieldHaveTile("x")).to.equal(true);
        });
        it('checkIfFieldHaveTile(booster) возвращает false если не находит тайл среди игрового поля', function(){
            let game = new BlastGame({n:5, m:10, c:6});
            expect(game.field.checkIfFieldHaveTile("x")).to.equal(false);
        });
    });
    describe('BlastGame.hasPairs', function(){
        it('new BlastGame() всегда создает поле с >=1й парой соседних фишек (game.hasPairs == true)', function(){
            let game = new BlastGame({n:5, m:10, c:6});
            expect(game.hasPairs).to.equal(true);
        });
    });
    describe('BlastGame.minimalGroup', function () {
        it('new BlastGame передан аргумент k=0, но minimalGroup всегда >= 2', function () {
            let game = new BlastGame({n:5, m:10, c:6, k:0});
            expect(game.settings.minimalGroup).to.equal(2);
        });
        it('new BlastGame передан аргумент k=1, но minimalGroup всегда >= 2', function () {
            let game = new BlastGame({n:5, m:10, c:6, k:1});
            expect(game.settings.minimalGroup).to.equal(2);
        });
        it('new BlastGame передан аргумент k=3, minimalGroup = 3', function () {
            let game = new BlastGame({n:5, m:10, c:6, k:3});
            expect(game.settings.minimalGroup).to.equal(3);
        });
    });
    // конструктор базового класса бустеров
    // конструктор бустера-телепорта
    // конструктор бустера-бомбы
    // экшн бустера-телепорта
    // экшн бустера-бомбы
});