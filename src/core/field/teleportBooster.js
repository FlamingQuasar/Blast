import { Booster } from "./booster.js";
import { Field } from "./field.js";
import { Tile } from "./tile.js";

export class TeleportBooster extends Booster{
    static TILETYPE = "t";
    /**
    * Бустер-телепорт принимает аргументом метод ожидания второй клетки для перестановки
    * @constructor
    * @param {object} field - Текущее игровое поле
    * @param {function} getSecondTilePosition - функция выбора второй фишки(тайла) для смены с первым
    */
    constructor({field, getSecondTilePosition=()=>{}}){ // field возможно лучше заменить на game.field
        super({field});
        this.tileType = TeleportBooster.TILETYPE;
        this.getSecondTilePosition = getSecondTilePosition;
        /*this._doAction = ()=>{
            console.log("additional action");
        };*/
        this.doAction({position:[2,3]});
    }
    
    fireTileReturnScore(){
        //let firstSwapTile включить метод ожидания получения первого тайла для свапа
        //предусмотреть чтобы не нажимался текущий тайл t
        //let secondSwapTile включить метод ожидания получения второго тайла для свапа
        //предусмотреть чтобы не нажимался текущий тайл t
        
        console.log("TELEPORT start");
        //let tileToSwapPosition = this.getSecondTilePosition();
        let tileToSwap = this.field.getTileOnPosition([2, 2]);
        let position = this.field.getPositionOfTile(this);
        if(position){
            this.field[position.row][position.col] = tileToSwap;
            this.field[2][2] = this;//new Tile({colorsCount:Field.settings.colorsCount});
        }
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