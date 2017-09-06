export default class MercleNode{
    constructor(parent,radius,napr,key,name) {
        this.state = {
            xCoord: 0,
            yCoord: 0,
            radius: radius,

            leftNode: null,
            rightNode: null,
            parent:parent,

            canvas: null,
            napr:napr,
            key:key,

            name:name,
        }
    }

    draw(canvas,parent) {
        if (this.state.canvas) {
            var context = this.state.canvas.getContext('2d');
            var centerX = this.state.xCoord;
            var centerY = this.state.yCoord;
            var radius = this.state.radius;

            if(parent){
                context.beginPath();
                context.strokeStyle = '#000000';
                context.moveTo(this.state.xCoord,this.state.yCoord);
                context.lineTo(parent.state.xCoord,parent.state.yCoord);
                context.stroke();
            }

            context.beginPath();
            context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
            context.fillStyle = this.state.napr == "root"? "#630000":'#003300';
            context.fill();
            context.lineWidth = 5;
            context.strokeStyle = this.state.napr == "root"? "#cd0000":'#00b800';
            context.stroke();
            context.fillStyle = 'black';
            context.font = "15px Arial";
            context.fillText("Block_" + this.state.name,this.state.xCoord,this.state.yCoord - 1.2*this.state.radius);

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
                    count = 1 + this.state.rightNode.childrenCount();
                }

                this.state.xCoord = this.state.parent.state.xCoord - (count + 1) * xDistance;
                this.state.yCoord = this.state.parent.state.yCoord + yDistance;
                break;
            case "right":
                count = 0;
                if(this.state.leftNode){
                    count = 1 + this.state.leftNode.childrenCount();
                }

                this.state.xCoord = this.state.parent.state.xCoord + (count + 1) * xDistance;
                this.state.yCoord = this.state.parent.state.yCoord + yDistance;
                break;
            case "root":
                count = 0;
                if(this.state.leftNode){
                    count = 1 + this.state.leftNode.childrenCount();
                }

                this.state.xCoord = (count + 1) * xDistance;
                this.state.yCoord = yDistance;
                break;
        }

        if(this.state.leftNode){
            this.state.leftNode.updateCoordinates(xDistance,yDistance);
        }

        if(this.state.rightNode){
            this.state.rightNode.updateCoordinates(xDistance,yDistance);
        }
    }

    getHash(){
        var md5 = require('md5');
        var result = '';
        if(this.state.rightNode || this.state.rightNode){
            if(this.state.rightNode){
                result += md5(this.state.rightNode.getHash());
            }
            if(this.state.leftNode){
                result += md5(this.state.leftNode.getHash());
            }
            if(this.state.rightNode && this.state.rightNode) {
                result = md5(result);
            }
        } else{
            result = md5(this.state.key);
        }
        return result;
    }
}