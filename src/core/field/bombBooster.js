import { Booster } from "./booster.js";


export class BombBooster extends Booster{
    static TILETYPE = "b";
    constructor({field}){
        super({field});
        this.tileType = BombBooster.TILETYPE;
    }
}

