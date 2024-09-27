import { Field } from "./field.js";
import { Tile } from "./tile.js";

export class TeleportBooster extends Tile{
    static TILETYPE = "t";
    /**
    * Бустер-телепорт принимает аргументом метод ожидания второй клетки для перестановки
    * @constructor
    * @param {object} field - Текущее игровое поле
    */
    constructor({field}={}){
        super({colorsCount:0});
        this.field = field;
        this.tileType = TeleportBooster.TILETYPE;
    }

    async fireTileReturnScore(){
        // Вывести из строя текущий тайл телепорта
        this.tileType = Tile.EMPTYTILE;

        // Запросить координаты первого тайла для телепортации 
        let pos1 = await Field.tapTile("Позиция первого тайла для телепорта: ");
        let firstTile = null, secondTile = null;
        if(pos1 != 0 && pos1 != undefined){
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
            pos2 = await Field.tapTile("Позиция второго тайла для телепорта: ");
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
        // Обновить соседские отношения тайлов-пар для новой обстановке на игровом поле
        this.field.updateNeighbourRelations();
        // Данный тайл телепорта отмечен как пустой ("_") и должен сгореть
        this.field.replaceAfterBurn();
        // TODO: возможный бонус: телепортированные тайлы должны сами активироваться, будто на них нажали
        // если есть пары, поджечь оба свапнутых тайла, если у них есть похожие соседи
        return 0;
    }
}