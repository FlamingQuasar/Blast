import { Tile } from "./tile.js";

export class Booster extends Tile{
    /**
    * Базовый класс для Бустеров, в игре нет "просто" бустеров
    * @constructor
    * @param {object} field - Текущее игровое поле
    */
    constructor({field}={}){
        super({colorsCount:0});
        this.field = field;
        this.doAction.bind(this);
    }

    /**
    * Общий метод для вызова дейтсвия бустера
    * @param {object} field - Текущее игровое поле
    */
    doAction({position, callback}={}){ //аргументы возможно надо удалить
        this._doAction(position);
    }
    _doAction(){}
}
