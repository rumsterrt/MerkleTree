import React, { Component, PropTypes } from 'react';
import BinaryNode from './BinaryNode.jsx';

// Tree component - represents a single tree

export default class BinaryTree extends Component {
    constructor(){
        super();

        var node = new BinaryNode(null,1200/2,60,1200,25,0,"Root","Root");

        this.state = {
            startNode : node,
        }
    }

    componentDidMount() {
        this.updateCanvas();
        this.refs.canvas.tree = this;
        this.refs.canvas.counter = 0;
        this.refs.canvas.addEventListener('mousedown', function (evt) {
            let rect = evt.target.getBoundingClientRect();
            let position = {
                x: evt.clientX - rect.left,
                y: evt.clientY - rect.top,
            };
            let result = this.tree.state.startNode.isClicked(position);
            if (this.counter == 0) {
                this.counter = 1;
                setTimeout(() => {
                    if(this.counter == 1) {

                        if (result) {
                            var hashValue = prompt("Enter value:", "");
                            if (hashValue) {
                                result.insert(hashValue);
                            }
                        }
                        this.tree.forceUpdate();
                    }
                    this.counter = 0;
                }, 300)
            } else {
                this.counter = 0;
                if (result) {
                    result.remove();
                }
                this.tree.forceUpdate();
            }
            console.log("counter: " + this.counter);
        }, false);
    }

    render() {
        return (
            <li className='BinaryTree'>
                <canvas ref='canvas' width="1200" height="500"></canvas>
            </li>
        );
    }

    componentDidUpdate() {
        this.updateCanvas();
    }

    updateCanvas() {
        this.refs.canvas.getContext('2d').clearRect(0,0,this.refs.canvas.width,this.refs.canvas.height);
        this.state.startNode.draw(this.refs.canvas);
     }
}

BinaryTree.propTypes = {
    // This component gets the task to display through a React prop.
    // We can use propTypes to indicate it is required
    binaryTree: PropTypes.object.isRequired,
};