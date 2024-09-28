import { Tile } from "./tile.js";
import { Field } from "./field.js";

export class SuperBooster extends Tile{
    static TILETYPE = "L"; // Супер-тайл от слова Large
    static EFFECTS = ["burnBomb","burnRow","burnColumn","burnField"];
    constructor({field={}}){
        super({colorsCount:0});
        this.field = field;
        this.radius = Field.settings.radius;
        this.effect = SuperBooster.EFFECTS[Field.settings.largeGroupBonusEffect];
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