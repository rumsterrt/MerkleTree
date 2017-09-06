import React, { Component, PropTypes } from 'react';
import MercleNode from './MercleNode.jsx';

// Tree component - represents a single tree

export default class MercleTree extends Component {
    constructor() {
        super();

        this.rootNode = null;
        this.textData = null;
        this.blockSize = null;

        this.width = 2400;
        this.height = 1200;
        this.nodeRadius = 25;
    }

    componentDidMount() {
        if (this.textData) {
            this.updateTextData(this.textData, this.blockSize);
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
        window.refs = {
            canvas: this.refs.canvas,
        };

        this.refs.canvas.addEventListener('mousedown', function (evt) {
            let rect = evt.target.getBoundingClientRect();
            let position = {
                x: evt.clientX - rect.left,
                y: evt.clientY - rect.top,
            };
            let result = this.treeParam.tree.rootNode.isClicked(position);
            if(result) {
                window.alert("Key: " + result.state.key + "\nHash: " + result.getHash());
            } else{
                var evtn = evt || event;
                this.treeParam.dragging = true;
                this.treeParam.last.x = evtn.clientX;
                this.treeParam.last.y = evtn.clientY;
                evt.preventDefault();
            }
        }, false);

        window.addEventListener('mousemove', function(e) {
            var evt = e || event;
            if (this.refs.canvas.treeParam.dragging) {
                var delta = {
                    x: evt.clientX - this.refs.canvas.treeParam.last.x,
                    y: evt.clientY - this.refs.canvas.treeParam.last.y,
                }
                this.refs.canvas.treeParam.last.x = evt.clientX;
                this.refs.canvas.treeParam.last.y = evt.clientY;

                if(this.refs.canvas.width > this.refs.canvas.parentNode.clientWidth) {
                    if (this.refs.canvas.treeParam.marginLeft + delta.x <= 0 && this.refs.canvas.treeParam.marginLeft + delta.x >= -this.refs.canvas.width + this.refs.canvas.parentNode.clientWidth) {
                        this.refs.canvas.treeParam.marginLeft += delta.x;
                    } else {
                        this.refs.canvas.treeParam.marginLeft = this.refs.canvas.treeParam.marginLeft + delta.x > 0 ? 0 : -this.refs.canvas.width + this.refs.canvas.parentNode.clientWidth;
                    }
                    this.refs.canvas.style.marginLeft = this.refs.canvas.treeParam.marginLeft + "px";
                }

                if(this.refs.canvas.height > this.refs.canvas.parentNode.clientHeight) {
                    if (this.refs.canvas.treeParam.marginTop + delta.y <= 0 && this.refs.canvas.treeParam.marginTop + delta.y >= -this.refs.canvas.height + this.refs.canvas.parentNode.clientHeight) {
                        this.refs.canvas.treeParam.marginTop += delta.y;
                    } else {
                        this.refs.canvas.treeParam.marginTop = this.refs.canvas.treeParam.marginTop + delta.y > 0 ? 0 : -this.refs.canvas.height + this.refs.canvas.parentNode.clientHeight;
                    }
                    this.refs.canvas.style.marginTop = this.refs.canvas.treeParam.marginTop + "px";
                }

            }
            e.preventDefault();
        }, false);

        window.addEventListener('mouseup', function() {
            this.refs.canvas.treeParam.dragging = false;
        }, false);
    }

    componentWillUpdate() {
        if (this.textData) {
            this.updateTextData(this.textData, this.blockSize);
        }
    }

    render() {
        return (
            <li className='MercleTree'>
                <div id="wrapper">
                    <canvas ref='canvas' width={this.width} height={this.height}></canvas>
                </div>
            </li>
        );
    }

    componentDidUpdate() {
        this.updateCanvas();
    }

    updateCanvas() {
        if(this.rootNode) {
            this.refs.canvas.getContext('2d').clearRect(0, 0, this.refs.canvas.width, this.refs.canvas.height);
            this.rootNode.draw(this.refs.canvas);
        }
    }

    updateTextData(data, blockSize) {
        this.refs.canvas.style.marginTop = 0;
        this.refs.canvas.style.marginLeft = 0;
        if(!blockSize || blockSize<=0)
        {
            blockSize = 20;
        }

        if (data) {
            let i = 0;
            let j = 0;
            let array = new Array();
            let leafArray = new Array();
            for (i = 0; i < data.length; i++) {
                j = Math.floor(i / blockSize);
                if (array[j]) {
                    array[j] += data[i];
                } else {
                    array[j] = data[i];
                    if (j > 0) {
                        leafArray.push(new MercleNode(null, this.nodeRadius, leafArray.length % 2 == 0 ? "left" : "right", array[j - 1],(leafArray.length + 1).toString()));
                    }
                }
            }
            leafArray.push(new MercleNode(null, this.nodeRadius, leafArray.length % 2 == 0 ? "left" : "right", array[j],(leafArray.length + 1).toString()));

            this.rootNode = this.createLevel(leafArray);
            this.rootNode.updateCoordinates(this.nodeRadius*1.5,this.nodeRadius*5);
            let rect = this.getTreeRect();
            this.width = rect.width + this.nodeRadius*2;
            this.height = rect.height + this.nodeRadius*2;
        }
    }

    createLevel(data) {
        var leafArray = new Array();
        let i = 0;
        let j = 0;
        for (i = 0; i < data.length; i += 2) {
            var keyData = data[i].state.key;
            var nameData = data[i].state.name;
            if (data[i + 1]) {
                keyData += data[i + 1].state.key;
                nameData += data[i + 1].state.name;
            }
            leafArray.push(new MercleNode(null, this.nodeRadius, leafArray.length % 2 == 0 ? "left" : "right", keyData,nameData));
            leafArray[leafArray.length - 1].state.leftNode = data[i];
            data[i].state.parent = leafArray[leafArray.length - 1];
            if (data[i + 1]) {
                leafArray[leafArray.length - 1].state.rightNode = data[i + 1];
                data[i + 1].state.parent = leafArray[leafArray.length - 1];
            }
        }

        if (leafArray.length > 1) {
            return this.createLevel(leafArray);
        } else {
            leafArray[0].state.napr = "root";
            leafArray[0].state.xCoord = this.refs.canvas.width/2;
            leafArray[0].state.yCoord = 40;
            return leafArray[0];
        }
    }

    getTreeRect(){
        var lefttist = this.rootNode;
        var righttist = this.rootNode;
        var prefLefttist = this.rootNode;
        var prefRighttist = this.rootNode;
        while(lefttist){
            prefLefttist = lefttist;
            lefttist = lefttist.state.leftNode;
        }
        while(righttist){
            prefRighttist = righttist;
            righttist = righttist.state.rightNode;
        }
        var height = prefLefttist.state.yCoord>prefRighttist.state.yCoord?prefLefttist.state.yCoord:prefRighttist.state.yCoord;
        return{
            width: prefRighttist.state.xCoord,
            height:height,
        }
    }
}

MercleTree.propTypes = {
    // This component gets the task to display through a React prop.
    // We can use propTypes to indicate it is required
    mercleTree: PropTypes.object.isRequired,
};