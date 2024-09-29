export class Tile{
    hasSameNeighbour = false;
    static minimalGroupCount;
    static EMPTYTILE = "💥";

    constructor({colorsCount, minimalGroupCount = 2}){
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
        let counter = depth-1;
        if(counter>0 && this[direction] != null){
            this[direction].setTypeAndSameNeighbour(direction, type, --counter);
        }
    }

    // Активировать (сжечь) фишку на поле и ее соседей, если соответствуют
    // {rate} коэффициент умножения цены очков за нажатую фишку 
    fireTileReturnScore(rate=1, message){
        if(this._fireTileReturnScore.toString()!= "_fireTileReturnScore(){}"){
        // Если у нас непростой тайл, а наследник реализовавший метод взрыва
            this._fireTileReturnScore();
            return 70; // За взрывной тайл больше очков
        }
        
        let scoreToAdd = 0;
        if(this.hasSameNeighbour){
            this.hasSameNeighbour = false;
            if(this.left?.tileType == this.tileType && this.left?.hasSameNeighbour){
                scoreToAdd += this.left.fireTileReturnScore();
                rate +=1;
            }
            if(this.top?.tileType == this.tileType && this.top?.hasSameNeighbour){
                scoreToAdd += this.top.fireTileReturnScore();
                rate +=1;
            }
            if(this.right?.tileType == this.tileType && this.right?.hasSameNeighbour){
                scoreToAdd += this.right.fireTileReturnScore();
                rate +=1;
            }
            if(this.bottom?.tileType == this.tileType && this.bottom?.hasSameNeighbour){
                scoreToAdd += this.bottom.fireTileReturnScore();
                rate +=1;
            }
            this.tileType = Tile.EMPTYTILE;
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