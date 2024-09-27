import { Tile } from "./tile.js";


export class BombBooster extends Tile{
    static TILETYPE = "b";
    constructor({field}={}){
        super({colorsCount:0});
        this.field = field;
        this.tileType = BombBooster.TILETYPE;
    }
    
    async fireTileReturnScore(){
        console.log("boom!");
    }
}

