
class Booster{
    static boosterType = {BOMB:"BOMB", TELEPORT:"TELEPORT"} // возможно надо убрать
    /**
    * Базовый класс \ интерфейс для Бустеров
    * @constructor
    * @param {number} charge - Количество зарядов бустера
    * @param {object} field - Текущее игровое поле
    */
    constructor({charge, field}){
        this.charge = charge;
        this.field = field;
        this.doAction.bind(this);
    }

    doAction({position, callback}={}){ //аргументы возможно надо удалить
        if(this.charge > 0){
            console.log("base action");
            this._doAction(position);
            this.charge --;
        }
    }
    _doAction(){}
}

class TeleportBooster extends Booster{

    constructor({charge, field, clickSecondItemToSwap}){
        super({charge, field});
        this.clickSecondItemToSwap = clickSecondItemToSwap;
        this.type = Booster.boosterType.TELEPORT; // возможно надо убрать
        /*this._doAction = ()=>{
            console.log("additional action");
        };*/
        this.doAction({position:[2,3]});
    }
    _doAction(position){
        let firstItem = this.field.getItemOnPosition(position);
        let secondItem = this.field.getItemOnPosition(this.clickSecondItemToSwap());
        [firstItem, secondItem] = Field.swap(firstItem, secondItem);
        // тут можно callbackEffect(); или return true и проигрыш анимации
        console.log("additional action 2");
        console.log(position);
    }
}