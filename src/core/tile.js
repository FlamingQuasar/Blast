export class Tile{
    hasSameNeighbour = false;
    static minimalGroupCount;

    constructor({colorsCount, minimalGroupCount = 2}){
        this.color = Math.floor(Math.random() * colorsCount);
        Tile.minimalGroupCount = minimalGroupCount;
    }

    // Если совпадение по цвету с соседом есть, указать что у фишки есть группа
    checkNeighbourColorAndPush(neighbour){
        if(neighbour?.color === this.color){
            this.hasSameNeighbour = neighbour.hasSameNeighbour = true;
        }
    }

    // Активировать (сжечь) фишку на поле и ее соседей, если соответствуют
    // {rate} коэффициент умножения цены очков за нажатую фишку 
    fireTileReturnScore(rate=1){
        let scoreToAdd = 0;
        console.log("this.hasSameNeighbour: "+this.hasSameNeighbour);
        if(this.hasSameNeighbour){
            this.hasSameNeighbour = false;
            if(this.left?.color == this.color && this.left?.hasSameNeighbour){
                scoreToAdd += this.left.fireTileReturnScore();
                rate +=1;
            }
            if(this.top?.color == this.color && this.top?.hasSameNeighbour){
                scoreToAdd += this.top.fireTileReturnScore();
                rate +=1;
            }
            if(this.right?.color == this.color && this.right?.hasSameNeighbour){
                scoreToAdd += this.right.fireTileReturnScore();
                rate +=1;
            }
            if(this.bottom?.color == this.color && this.bottom?.hasSameNeighbour){
                scoreToAdd += this.bottom.fireTileReturnScore();
                rate +=1;
            }
            this.color = "_";
            scoreToAdd += 10 * rate;
        }
        return scoreToAdd;
    }

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
        this.checkNeighbourColorAndPush(this.left);
        this.checkNeighbourColorAndPush(this.top);
        this.checkNeighbourColorAndPush(this.right);
        this.checkNeighbourColorAndPush(this.bottom);
    }
}