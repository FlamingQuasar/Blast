import { Booster } from "./booster.js";
import { Field } from "./field.js";
import { Tile } from "./tile.js";

export class TeleportBooster extends Booster{
    static TILETYPE = "t";
    static EMPTYTILE = "_";
    /**
    * Бустер-телепорт принимает аргументом метод ожидания второй клетки для перестановки
    * @constructor
    * @param {object} field - Текущее игровое поле
    */
    constructor({field}){ // field возможно лучше заменить на game.field
        super({field});
        this.tileType = TeleportBooster.TILETYPE;
        /*this._doAction = ()=>{
            console.log("additional action");
        };*/
        this.doAction({position:[2,3]});
    }

    async fireTileReturnScore(rate){
        // Вывести из строя текущий тайл телепорта
        this.tileType = TeleportBooster.EMPTYTILE;

        // Запросить координаты первого тайла для телепортации 
        let pos1 = await Field.tapTile("Позиция первого тайла: ");
        let firstTile = null, secondTile = null;
        if(pos1 != 0){
            firstTile = this.field.getTileOnPosition([+pos1[0], +pos1[1]])
        }
        else{
            console.log("Метод захвата тайлов неопределен");
            return 0; // вернуть 0 очков
        }
        // Второй тайл для телепорта не должен быть тем же самым что первый, запросим любой другой
        let pos2 = [+pos1[0],+pos1[1]]; 
        do{
            // Запросить координаты второго тайла для телепортации
            pos2 = await Field.tapTile("Позиция второго тайла: ");
            if(pos2 != 0){
                secondTile = this.field.getTileOnPosition([+pos2[0], +pos2[1]])
            }
            else{
                console.log("Метод захвата тайлов неопределен");
                return 0; // вернуть 0 очков
            }  
        }
        while(pos2[0] == +pos1[0] && pos2[1] == +pos1[1]);
              
        //сделать свап двух тайлов
        [this.field[+pos1[0]][+pos1[1]], this.field[+pos2[0]][+pos2[1]]] 
            = Field.swap(this.field[+pos1[0]][+pos1[1]], this.field[+pos2[0]][+pos2[1]]);

        //и поджечь оба свапнутых тайла, если у них есть похожие соседи
        // код "ниже" переделать
        /*let position = this.field.getPositionOfTile(this);
        if(position){
            this.field[position.row][position.col] = tileToSwap;
            this.field[2][2] = this;//new Tile({colorsCount:Field.settings.colorsCount});
        }*/
        // после свапа двух выбранных тайлов, данный тайл должен пометиться как пустой "_" и сгореть
        // телепортированные тайлы сразу не активируются, а могут включиться в следующем ходу если на них нажать
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