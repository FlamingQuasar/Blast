import { Tile } from "./tile.js";
import { Field } from "./field.js";

export class SuperBooster extends Tile{
    static TILETYPE = "L"; // Супер-тайл от слова Large
    static EFFECTS = ["burnBomb","burnRow","burnColumn","burnCross","burnField"];
    constructor({field={}}){
        super({colorsCount:0});
        this.field = field;
        this.radius = Field.settings.bombRadius;
        this.effect = SuperBooster.EFFECTS[Field.settings.largeGroupBonusEffect];
        this.tileType = SuperBooster.TILETYPE;
        //this._fireTileReturnScore = this._fireTileReturnScore.bind(this);
    }

    _fireTileReturnScore(rate=1, burnAnimationCallback=()=>{}){        
        if(this.tileType != Tile.EMPTYTILE){
            let score = 50;
            this.tileType = Tile.EMPTYTILE;
            this.hasSameNeighbour = true;            
                
            // Вызвать колбек на анимацию взрыва самого супер-тайла
            if(this.field != undefined){
                let position = this.field.getPositionOfTile(this);
                burnAnimationCallback(position.row, position.col);
            }

            switch(this.effect){
                // Взорвать радиус бомбы радиуса R
                case SuperBooster.EFFECTS[0]:{
                    // Параметры: tile, direction, radius, crossType=null, field=null, burnAnimationCallback
                    score += Tile.firePairReturnScore(this.top, "top", 0+this.radius, null, this.field, burnAnimationCallback);
                    score += Tile.firePairReturnScore(this.right, "right", 0+this.radius, null, this.field, burnAnimationCallback);
                    score += Tile.firePairReturnScore(this.bottom, "bottom", 0+this.radius, null, this.field, burnAnimationCallback);
                    score += Tile.firePairReturnScore(this.left, "left", 0+this.radius, null, this.field, burnAnimationCallback);
                    return score;
                } 
                // Взорвать всю строку
                case SuperBooster.EFFECTS[1]:{
                    score += Tile.firePairReturnScore(this.right, "right", Infinity, null, this.field, burnAnimationCallback);
                    score += Tile.firePairReturnScore(this.left, "left", Infinity, null, this.field, burnAnimationCallback);
                    return score;
                } 
                // Взорвать весь столбец
                case SuperBooster.EFFECTS[2]:{
                    score += Tile.firePairReturnScore(this.top, "top", Infinity, null, this.field, burnAnimationCallback);
                    score += Tile.firePairReturnScore(this.bottom, "bottom", Infinity, null, this.field, burnAnimationCallback);
                    return score;
                }
                // Взорвать крест радиуса R
                case SuperBooster.EFFECTS[3]:{
                    score += Tile.firePairReturnScore(this.top, "top", 0+this.radius, "cross", this.field, burnAnimationCallback);
                    score += Tile.firePairReturnScore(this.right, "right", 0+this.radius, "cross", this.field, burnAnimationCallback);
                    score += Tile.firePairReturnScore(this.bottom, "bottom", 0+this.radius, "cross", this.field, burnAnimationCallback);
                    score += Tile.firePairReturnScore(this.left, "left", 0+this.radius, "cross", this.field, burnAnimationCallback);
                    return score;
                }
                // Взорвать всё игровое поле
                case SuperBooster.EFFECTS[4]:{
                    score = 0;
                    for(let i=0; i<this.field.length; i++){
                        score += this.field[i].length * 5;
                        for(let j=0; j<this.field[i].length; j++){
                            this.field[i][j].tileType = Tile.EMPTYTILE;
                            this.hasSameNeighbour = true;
                        }
                    }
                    return score;
                }
            }
        }
        return 0;
    }
}