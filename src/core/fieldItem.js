export class FieldItem{
    hasSameNeighbour = false;

    constructor(colorsCount){
        this.color = Math.floor(Math.random() * colorsCount);
    }

    checkNeighbourColorAndPush(neighbour){
        if(neighbour?.color === this.color){
            this.hasSameNeighbour = neighbour.hasSameNeighbour = true;
        }
    }

    fireItem(){
        if(this.hasSameNeighbour){
            this.hasSameNeighbour = false;
            if(this.left?.color == this.color && this.left?.hasSameNeighbour) this.left.fireItem();
            if(this.top?.color == this.color && this.top?.hasSameNeighbour) this.top.fireItem();
            if(this.right?.color == this.color && this.right?.hasSameNeighbour) this.right.fireItem();
            if(this.bottom?.color == this.color && this.bottom?.hasSameNeighbour) this.bottom.fireItem();
            this.color = "_";
        }
    }

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

    checkNeighbours(){
        this.checkNeighbourColorAndPush(this.left);
        this.checkNeighbourColorAndPush(this.top);
        this.checkNeighbourColorAndPush(this.right);
        this.checkNeighbourColorAndPush(this.bottom);
    }
}