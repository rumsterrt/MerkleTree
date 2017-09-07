import React, { Component, PropTypes } from 'react';

// Tree component - represents a single tree

export default class MercleTreeUI extends Component {
    constructor() {
        super();

        this.width = 0;
        this.height = 0;

        this.offset = {
            x: 0,
            y: 0
        }

        this.points = new Array();
    }

    componentDidMount() {
        if (this.props.treeData) {
            this.draw();
            this.updateTextData();
        }

        this.refs.canvas.treeParam = {
            tree: this,
            dragging: false,
            last: {
                x:0,
                y:0,
            },
            marginLeft: 0,
            marginTop:0,
        };

        this.refs.canvas.width = this.refs.canvasWindow.offsetWidth;
        this.refs.canvas.height = this.refs.canvasWindow.offsetHeight;

        window.refs = {
            canvas: this.refs.canvas,
        };

        this.refs.canvas.addEventListener('mousedown', function (evt) {
            let rect = evt.target.getBoundingClientRect();
            let position = {
                x: evt.clientX - rect.left,
                y: evt.clientY - rect.top,
            };
            let result = this.treeParam.tree.getClickedNode(position);
            if(result) {
                window.alert("Name: " + result.getName() + "\nKey: " + result.key + "\nHash: " + result.getHash());
            } else{
                let evtn = evt || event;
                this.treeParam.dragging = true;
                this.treeParam.last  = {
                    x: evt.clientX,
                    y: evt.clientY,
                };
                evt.preventDefault();
            }
        }, false);

        window.addEventListener('mousemove', function(e) {
            let evt = e || event;
            let canvas = this.refs.canvas;
            let treeParam = canvas.treeParam;
            let tree = canvas.treeParam.tree;
            if (treeParam.dragging) {
                let delta = {
                    x: evt.clientX - treeParam.last.x,
                    y: evt.clientY - treeParam.last.y,
                }

                treeParam.last = {
                    x: evt.clientX,
                    y: evt.clientY,
                };
                let offset={x:0,y:0};
                if (tree.width > canvas.width) {
                    if (treeParam.marginLeft + delta.x <= 0 && treeParam.marginLeft + delta.x >= -tree.width + canvas.width) {
                        treeParam.marginLeft += delta.x;
                    } else {
                        treeParam.marginLeft = treeParam.marginLeft + delta.x > 0 ? 0 : -tree.width + canvas.width;
                    }
                    offset.x = treeParam.marginLeft;
                }

                if (tree.height > canvas.height) {
                    if (treeParam.marginTop + delta.y <= 0 && treeParam.marginTop + delta.y >= -tree.height + canvas.height) {
                        treeParam.marginTop += delta.y;
                    } else {
                        treeParam.marginTop = treeParam.marginTop + delta.y > 0 ? 0 : -tree.height + canvas.height;
                    }
                    offset.y = treeParam.marginTop;
                }

                if(tree.offset.x != offset.x||tree.offset.y != offset.y) {
                    tree.offset = offset;
                    tree.draw();
                }
            }
            e.preventDefault();
        }, false);

        window.addEventListener('mouseup', function() {
            this.refs.canvas.treeParam.dragging = false;
        }, false);
    }

    componentWillUpdate() {
        if (this.props.treeData) {
        }
    }

    render() {
        return (
            <li className='MercleTree'>
                <div id="wrapper" ref = "canvasWindow">
                    <canvas className="canvas" ref='canvas'>

                    </canvas>
                </div>
            </li>
        );
    }

    componentDidUpdate() {
        if (this.props.treeData) {
            this.draw();
            this.updateTextData();
        }
    }

    updateTextData() {
        this.offset = {
            x: 0,
            y: 0,
        };
        let rect = this.getTreeRect(this.props.xDistance,this.props.yDistance);
        this.width = rect.width + this.props.radius * 2;
        this.height = rect.height + this.props.radius * 2;
    }

    draw() {
        let rootNode =this.props.treeData.rootNode;
        this.points = new Array();
        if (this.refs.canvas && rootNode) {
            this.refs.canvas.getContext('2d').clearRect(0, 0, this.refs.canvas.width, this.refs.canvas.height);
            let recursive = (node,offset,xDis,yDis,array) => {

                let position = this.drawNode(this.refs.canvas,node,offset,xDis,yDis,this.props.radius);
                array.push({position:position,node:node});

                if (node.leftNode) {
                    recursive(node.leftNode,position,xDis,yDis,this.points);
                }
                if (node.rightNode) {
                    recursive(node.rightNode,position,xDis,yDis,this.points);
                }
            }
            return recursive(rootNode,this.offset,this.props.xDistance,this.props.yDistance,this.points);
        }
        return null;
    }

    getClickedNode(clickPos) {
        if (this.points && this.points.length > 0) {
            for (let i = 0; i < this.points.length; i++) {
                let position = this.points[i].position;
                let node = this.points[i].node;
                if ((Math.sqrt((clickPos.x - position.x) ** 2 + (clickPos.y - position.y) ** 2) < this.props.radius)) {
                    return node;
                }
            }
        }
        return null;
    }

    getTreeRect(xDistance,yDistance){
        let lefttist = this.props.treeData.rootNode;
        let righttist = this.props.treeData.rootNode;
        let prefLefttist = this.props.treeData.rootNode;
        let prefRighttist = this.props.treeData.rootNode;
        let leftPoint = {
            x:0,
            y:0
        }
        let rightPoint = {
            x:0,
            y:0
        }
        while(lefttist || righttist){
            if(lefttist) {
                prefLefttist = lefttist;
                leftPoint = this.getCoordinates(prefLefttist,leftPoint,xDistance,yDistance);
                lefttist = lefttist.leftNode;
            }
            if(righttist) {
                prefRighttist = righttist;
                rightPoint = this.getCoordinates(prefRighttist,rightPoint,xDistance,yDistance);
                righttist = righttist.rightNode;
            }
        }
        let height = leftPoint.y>rightPoint.y?leftPoint.y:rightPoint.y;
        return{
            width: rightPoint.x,
            height:height,
        }
    }

    getCoordinates(node,offset,xDistance,yDistance){
        switch (node.type){
            case "left":
                let count = 0;
                if(node.rightNode){
                    count = 1 + node.rightNode.childrenCount();
                }

                return {
                    x: offset.x - (count + 1) * xDistance,
                    y: offset.y + yDistance,
                };
            case "root":
            case "right":
                count = 0;
                if(node.leftNode){
                    count = 1 + node.leftNode.childrenCount();
                }

                return {
                    x: offset.x + (count + 1) * xDistance,
                    y: offset.y + yDistance,
                };
        }
        return{
            x:0,
            y:0,
        }
    }

    drawNode(canvas,node,offset,xDistance,yDistance,radius){
        let context = canvas.getContext('2d');
        let center = this.getCoordinates(node,offset,xDistance,yDistance);

        if (node.parent) {
            context.beginPath();
            context.strokeStyle = '#000000';
            context.moveTo(center.x, center.y);
            context.lineTo(offset.x, offset.y);
            context.stroke();
        }

        context.beginPath();
        context.arc(center.x, center.y, radius, 0, 2 * Math.PI, false);
        context.fillStyle = node.type == "root" ? "#630000" : '#003300';
        context.fill();
        context.lineWidth = 5;
        context.strokeStyle = node.type == "root" ? "#cd0000" : '#00b800';
        context.stroke();
        context.fillStyle = '#0062cd';
        context.font = "15px Arial";
        context.textAlign="center";
        context.fillText(node.getName(), center.x, center.y - 1.2 * radius);
        return center;
    }
}

MercleTreeUI.propTypes = {
    // This component gets the task to display through a React prop.
    // We can use propTypes to indicate it is required
    mercleTree: PropTypes.object.isRequired,
    treeData: PropTypes.object.isRequired,
    radius: PropTypes.number.isRequired,
    xDistance: PropTypes.number.isRequired,
    yDistance: PropTypes.number.isRequired,
};