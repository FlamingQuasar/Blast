import { Field } from "./field.js";

export class Tile{
    hasSameNeighbour = false;
    
    static minimalGroupCount;
    
    // константа обозначения пустого тайла после сгорания, подлежащего замещению (и в консоли VSCode смотрится)
    static EMPTYTILE = "💥";

    /**
     * Метод рекурсивного взрыва тайлов на уменьшающуюся глубину радиуса
     * @param {*} tile текущий тайл для его взрыва
     * @param {*} direction базовое направление, куда продолжать взрыв
     * @param {*} radius оставшийся радиус взрыва
     * @returns очки за взрыв тайлов для суммирования с очками за саму бомбу
     */
    static firePairReturnScore(tile, direction, radius, crossType=null, field=null, burnAnimationCallback=()=>{}){
        let score = 0;
        if(tile){
            score += 10;
            tile.setTypeAndSameNeighbour(direction, Tile.EMPTYTILE);

            // Вызов коллбека для анимации на UI
            if(field != null){
                let position = field.getPositionOfTile(tile);
                burnAnimationCallback(position.row, position.col);
            }

            radius--;
            if(radius>0){
                score += Tile.firePairReturnScore(tile[direction], direction, radius, 
                                            crossType, field, burnAnimationCallback);

                // Если выбран эффект взрыва не крест, не бесконечная строка или столбец, а простой взрыв
                // Тогда заполнить промежуточные позиции
                if(crossType == null && radius>1 && radius != Infinity){
                    let directions = ["left", "top", "right", "bottom"];
                    for(let dir of directions){
                        if(dir != direction){
                            score += Tile.firePairReturnScore(tile[dir], direction, 0, 
                                                crossType, field, burnAnimationCallback);
                        }
                    }
                }
            } 
            
        }
        return score;
    }

    constructor({field={}, colorsCount, minimalGroupCount = 2}){
        this.field = field;
        this.tileType = Math.floor(Math.random() * colorsCount);
        Tile.minimalGroupCount = minimalGroupCount;
    }

    // Если совпадение по цвету с соседом есть, указать что у фишки есть группа
    checkNeighbourTypeAndPush(neighbour){
        if(neighbour?.tileType === this.tileType && this.tileType != Tile.EMPTYTILE){
            this.hasSameNeighbour = neighbour.hasSameNeighbour = true;
        }
    }

    

    /**
     * Рекурсивно приобразовать тайлы в определенном направлении к определенному типа
     * @param {*} direction - направление связи тайла
     * @param {*} type - тип тайлов к которому надо преобразовать, например к взрыву
     * @param {*} depth - глубина соседних тайлов
     */
    setTypeAndSameNeighbour(direction, type, depth){
        this.tileType = type;
        this.hasSameNeighbour = true;
        //let counter = depth-1;
        //if(counter>0 && this[direction] != null){
         //   this[direction].setTypeAndSameNeighbour(direction, type, --counter);
        //}
    }

    // Активировать (сжечь) фишку на поле и ее соседей, если соответствуют
    // {rate} коэффициент умножения цены очков за нажатую фишку 
    fireTileReturnScore(rate=1, burnAnimationCallback=()=>{}){

        // Если метод _fireTileReturnScore имплементирован, то есть имеет тело
        if(this._fireTileReturnScore.toString() != "_fireTileReturnScore(){}"){
            // Когда не простой тайл, а наследник реализовавший метод взрыва
            console.log("this._fireTileReturnScore() from Tile");
            return this._fireTileReturnScore(rate, burnAnimationCallback);
        }
        
        let scoreToAdd = 0;
        if(this.hasSameNeighbour){
            this.hasSameNeighbour = false;
            if(this.left?.tileType == this.tileType && this.left?.hasSameNeighbour){
                scoreToAdd += this.left.fireTileReturnScore(rate, burnAnimationCallback);
                rate +=1;
            }
            if(this.top?.tileType == this.tileType && this.top?.hasSameNeighbour){
                scoreToAdd += this.top.fireTileReturnScore(rate, burnAnimationCallback);
                rate +=1;
            }
            if(this.right?.tileType == this.tileType && this.right?.hasSameNeighbour){
                scoreToAdd += this.right.fireTileReturnScore(rate, burnAnimationCallback);
                rate +=1;
            }
            if(this.bottom?.tileType == this.tileType && this.bottom?.hasSameNeighbour){
                scoreToAdd += this.bottom.fireTileReturnScore(rate, burnAnimationCallback);
                rate +=1;
            }
            this.tileType = Tile.EMPTYTILE;
            
            if(this.field != undefined){
                let position = this.field.getPositionOfTile(this);
                burnAnimationCallback(position.row, position.col);
            }
            scoreToAdd += 10 * rate;
        }
        return scoreToAdd;
    }
    _fireTileReturnScore(){}

    // Связать фишку с соседними фишками с 4 сторон
    initNeighbours(left, top, right, bottom){
        this.left = left;
        if(left != null) this.left.right = this;
        this.top = top;
        if(top != null) this.top.bottom = this;
        this.right = right;
        if(right != null) this.right.left = this;
        this.bottom = bottom;
        if(bottom != null) this.bottom.top = this;
        this.checkNeighbours();
    }

    // Проверить всех соседей текущей фишки на совпадение по цвету
    checkNeighbours(){
        this.checkNeighbourTypeAndPush(this.left);
        this.checkNeighbourTypeAndPush(this.top);
        this.checkNeighbourTypeAndPush(this.right);
        this.checkNeighbourTypeAndPush(this.bottom);
    }
}