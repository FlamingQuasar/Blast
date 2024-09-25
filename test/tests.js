import { BlastGame } from '../src/core/blastGame.js'
import { expect } from "chai"

describe('BlastGame class', function () {
    before(()=>console.log("Начало тестирования: импортировали BlastGame из модуля"));
    after(()=>console.log("Тестирование BlastGame пройдено"));

    for(let i=2, j=2; j<10 && i<10; i++, j++){
        const height = Math.floor(Math.random() * i) + 1;
        const width = Math.floor(Math.random() * j) + 1;
        describe(`Конструктор BlastGame создает игровое поле нужной высоты [${height} на ${width}]`, function(){
            let game = new BlastGame({n:height, m:width, c:6});
            setTimeout(function(){
                it(`new BlastGame создает поле высоты [${height}]`, function(){                
                    expect(game.field.length).to.equal(height);
                });
            },100);
            it(`new BlastGame создает поле ширины [${width}]`, function(){
                expect(game.field[0].length).to.equal(width);
            });
        });
    }
    
    
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
});