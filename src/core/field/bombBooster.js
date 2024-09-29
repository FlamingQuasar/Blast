import { Tile } from "./tile.js";

export class BombBooster extends Tile{
    static TILETYPE = "b";
    constructor({field={}, radius=3}){
        super({colorsCount:0});
        this.field = field;
        this.radius = radius;
        this.tileType = BombBooster.TILETYPE;
    }
    
    // Взорвать саму бомбу и инициировать взрывы прилегающего радиуса, как по направлениям, 
    // так и между ними по диагоналям
    _fireTileReturnScore(){
        if(this.tileType != Tile.EMPTYTILE){
            this.tileType = Tile.EMPTYTILE;
            this.hasSameNeighbour = true;

            let score = 50;
            score += Tile.firePairReturnScore(this.top, "top", 0+this.radius);
            score += Tile.firePairReturnScore(this.right, "right", 0+this.radius);
            score += Tile.firePairReturnScore(this.bottom, "bottom", 0+this.radius);
            score += Tile.firePairReturnScore(this.left, "left", 0+this.radius);

            return score;
        }
        return 0;
    }
}

