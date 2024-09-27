import { BlastGame } from "../blastGame.js";
import { Field } from "./field.js";
import { Tile } from "./tile.js";


export class BombBooster extends Tile{
    static TILETYPE = "b";
    constructor({field={}, radius=3}){
        super({colorsCount:0});
        this.field = field;
        this.radius = radius;
        this.tileType = BombBooster.TILETYPE;
    }
    
    _fireTileReturnScore(){
        if(this.tileType != Tile.EMPTYTILE){
            this.tileType = Tile.EMPTYTILE;
            if(this.top) 
                this.top.setTypeAndSameNeighbour("top", Tile.EMPTYTILE, this.radius);
            
            if(this.left) 
                this.left.setTypeAndSameNeighbour("left", Tile.EMPTYTILE, this.radius);
            
            if(this.right) 
                this.right.setTypeAndSameNeighbour("right", Tile.EMPTYTILE, this.radius);
            
            if(this.bottom) 
                this.bottom.setTypeAndSameNeighbour("bottom", Tile.EMPTYTILE, this.radius);
            this.hasSameNeighbour = true;
            
            //console.clear();
            // Todo : это хорошая фишка для консольного клиента, но тут она точно не должна
            /*let burnAfterTime = function(){
                //тайлы под действием бустера должны сгореть
                //console.clear();
                this.field.replaceAfterBurn();
                BlastGame.showField(this.field,Field.settings);
            }
            burnAfterTime = burnAfterTime.bind(this)
            setTimeout(burnAfterTime, 300);*/
            return false;
        }
        return false;
    }
}

