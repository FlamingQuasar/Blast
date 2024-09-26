import { Tile } from "./tile";

export class Booster extends Tile{
    /**
    * Базовый класс для Бустеров, в игре нет "просто" бустеров
    * @constructor
    * @param {object} field - Текущее игровое поле
    */
    constructor({field}){
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

export class TeleportBooster extends Booster{
/**
    * Бустер-телепорт принимает аргументом метод ожидания второй клетки для перестановки
    * @constructor
    * @param {object} field - Текущее игровое поле
    * @param {function} clickSecondItemToSwap - функция выбора второй фишки(тайла) для смены с первым
    */
    constructor({field, clickSecondItemToSwap}){ // field возможно лучше заменить на game.field
        super({field});
        this.clickSecondItemToSwap = clickSecondItemToSwap;
        /*this._doAction = ()=>{
            console.log("additional action");
        };*/
        this.doAction({position:[2,3]});
    }

    _doAction(position){
        let firstItem = this.field.getItemOnPosition(position);
        let secondItem = this.field.getItemOnPosition(this.clickSecondItemToSwap());
        if(firstItem != null && secondItem != null){
            [firstItem, secondItem] = Field.swap(firstItem, secondItem);
            // тут можно callbackEffect(); или return true и проигрыш анимации
            console.log("additional action 2");
            console.log(position);
        }
    }
}