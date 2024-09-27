import { Tile } from "./tile.js";

export class SuperBooster extends Tile{
    static TILETYPE = "L"; // Супер-тайл от слова Large
    static EFFECTS = ["burnBomb","burnRow","burnColumn","burnField"];
    constructor({field={}, largeGroupBonusEffect=0}){
        super({colorsCount:0});
        this.field = field;
        this.radius = radius;
        this.effect = SuperBooster.EFFECTS[largeGroupBonusEffect];
        this.tileType = SuperBooster.TILETYPE;
    }

    _fireTileReturnScore(){
        this.tileType = Tile.EMPTYTILE;
        switch(this.effect){
            // Взорвать радиус бомбы
            case SuperBooster.EFFECTS[0]:{

            } break;
            // Взорвать строку
            case SuperBooster.EFFECTS[1]:{

            } break;
            // Взорвать столбец
            case SuperBooster.EFFECTS[2]:{

            } break;
            // Взорвать игровое поле
            case SuperBooster.EFFECTS[3]:{

            }
        }
        return true;
    }
}