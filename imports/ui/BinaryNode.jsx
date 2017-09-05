export default class BinaryNode{
    constructor(parent,x,y,maxWidth,radius,level,napr,key) {
        this.state = {
            xCoord: x,
            yCoord: y,
            width:maxWidth,
            radius: radius,

            leftNode: null,
            rightNode: null,
            parent:parent,

            canvas: null,
            level:level,
            napr:napr,
            key:key,
        }
    }

    draw(canvas,parent) {
        if (this.state.canvas) {
            this.updateCoordinates(this.state.radius * 1.5,this.state.radius*2);

            var context = this.state.canvas.getContext('2d');
            var centerX = this.state.xCoord;
            var centerY = this.state.yCoord;
            var radius = this.state.radius;

            if(parent){
                context.beginPath();
                context.moveTo(this.state.xCoord,this.state.yCoord);
                context.lineTo(parent.state.xCoord,parent.state.yCoord);
                context.stroke();
            }

            context.beginPath();
            context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
            context.fillStyle = 'green';
            context.fill();
            context.lineWidth = 5;
            context.strokeStyle = '#003300';
            context.stroke();
            context.fillStyle = 'black';
            context.font = "15px Arial";
            context.fillText(this.state.key,this.state.xCoord,this.state.yCoord - 1.2*this.state.radius);

            if (this.state.leftNode) {
                this.state.leftNode.draw(this.state.canvas,this);
            }
            if (this.state.rightNode) {
                this.state.rightNode.draw(this.state.canvas,this);
            }

        } else {
            this.state.canvas = canvas;
            this.draw(this.state.canvas,parent);
        }
    }

    isClicked(position) {
        var result = null;
        if ((Math.sqrt((position.x - this.state.xCoord) ** 2 + (position.y - this.state.yCoord) ** 2) < this.state.radius)) {
            result = this;
        }
        if (this.state.leftNode && !result) {
            result = this.state.leftNode.isClicked(position);

        }
        if (this.state.rightNode && !result) {
            result = this.state.rightNode.isClicked(position);
        }

        return result;
    }

    insert(key){
        if(!this.state.leftNode){
            this.state.leftNode = new BinaryNode(this,this.state.xCoord - this.state.width/4 +this.state.radius*2,this.state.yCoord + this.state.radius*2,this.state.width/2,this.state.radius,this.state.level+1,"left",key);
        }else {
            if (!this.state.rightNode) {
                this.state.rightNode = new BinaryNode(this,this.state.xCoord + this.state.width/4 -this.state.radius*2, this.state.yCoord + this.state.radius * 2,this.state.width/2,this.state.radius,this.state.level+1,"right",key);
            }
        }
    }

    remove(){
        if (this.state.leftNode) {
            this.state.leftNode.remove();
            this.state.leftNode = null;
        }
        if (this.state.rightNode) {
            this.state.rightNode.remove();
            this.state.rightNode = null;
        }
        if(this.state.parent){
            if(this.state.napr == "left"){
                this.state.parent.state.leftNode = null;
            }

            if(this.state.napr == "right"){
                this.state.parent.state.rightNode = null;
            }
        }
    }

    childrenCount(){
        let result = 0;
        if (this.state.leftNode) {
            result += this.state.leftNode.childrenCount();
            result++;
        }
        if (this.state.rightNode) {
            result += this.state.rightNode.childrenCount();
            result++;
        }
        return result;
    }

    updateCoordinates(xDistance,yDistance){
        switch (this.state.napr){
            case "left":
                let count = 0;
                if(this.state.rightNode){
                    count = 1 + this.childrenCount();
                }

                this.state.xCoord = this.state.parent.state.xCoord - (count + 1) * xDistance;
                this.state.yCoord = this.state.parent.state.yCoord + yDistance;
                break;
            case "right":
                count = 0;
                if(this.state.leftNode){
                    count = 1 + this.childrenCount();
                }

                this.state.xCoord = this.state.parent.state.xCoord + (count + 1) * xDistance;
                this.state.yCoord = this.state.parent.state.yCoord + yDistance;
                break;
        }
    }
}