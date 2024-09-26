import { Booster } from "./booster.js";

export class TeleportBooster extends Booster{
    static TILETYPE = "t";
    /**
    * Бустер-телепорт принимает аргументом метод ожидания второй клетки для перестановки
    * @constructor
    * @param {object} field - Текущее игровое поле
    * @param {function} clickSecondItemToSwap - функция выбора второй фишки(тайла) для смены с первым
    */
    constructor({field, clickSecondItemToSwap=()=>{}}){ // field возможно лучше заменить на game.field
        super({field});
        this.tileType = TeleportBooster.TILETYPE;
        this.clickSecondItemToSwap = clickSecondItemToSwap;
        /*this._doAction = ()=>{
            console.log("additional action");
        };*/
        this.doAction({position:[2,3]});
    }
    fireTileReturnScore(){
        // включить метод ожидания получения второго тайла для свапа
        console.log("TELEPORT");
        return 0;
    }

    _doAction(position){
        /*let firstItem = this.field.getTileOnPosition(position);
        let secondItem = this.field.getTileOnPosition(this.clickSecondItemToSwap());
        if(firstItem != null && secondItem != null){
            [firstItem, secondItem] = Field.swap(firstItem, secondItem);
            // тут можно callbackEffect(); или return true и проигрыш анимации
            console.log("additional action 2");
            console.log(position);
        }*/
    }
}