import { BlastGame } from '../src/core/blastGame.js'
import { expect } from "chai"

describe('BlastGame class', function () {
    before(()=>console.log("Начало тестирования: импортировали BlastGame из модуля"));
    after(()=>console.log("Тестирование BlastGame пройдено"));
    describe('BlastGame.hasPairs', function(){
        if('new BlastGame всегда создает поле с не менее чем 1й парой соседних фишек', function(){
            let game = new BlastGame({n:5, m:10, c:6});
            expect(game.hasPairs).to.equal(true);
        });
    });
    describe('BlastGame.minimalGroup', function () {
        it('new BlastGame передан аргумент k=0, но minimalGroup всегда >= 2', function () {
            let game = new BlastGame({n:5, m:10, c:6, k:0});
            expect(game.minimalGroup).to.equal(2);
        });
        it('new BlastGame передан аргумент k=1, но minimalGroup всегда >= 2', function () {
            let game = new BlastGame({n:5, m:10, c:6, k:1});
            expect(game.minimalGroup).to.equal(2);
        });
        it('new BlastGame передан аргумент k=3, minimalGroup = 3', function () {
            let game = new BlastGame({n:5, m:10, c:6, k:3});
            expect(game.minimalGroup).to.equal(3);
        });
    });
});