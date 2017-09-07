import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { createContainer } from 'meteor/react-meteor-data';

import MercleTree from '../api/MercleTree.jsx';
import MercleTreeUI from '../ui/MercleTreeUI.jsx';

// App component - represents the whole app
const Tree = new MercleTreeUI.constructor();

class App extends Component {
    constructor(props){
        super(props);

        this.treeData = null;
    }

    handleSubmit(event) {
        event.preventDefault();

        // Find the text field via the React ref
        const text = ReactDOM.findDOMNode(this.refs.textInput).value.trim();
        const size = parseInt(ReactDOM.findDOMNode(this.refs.blockSize).value.trim());

        console.log(text+"\n"+size);

        this.treeData = new MercleTree(text,size);

        this.forceUpdate();
    }

    render() {
        return (
            <div className="container">
                <ul>
                    <div className="container">
                        <header>
                            <h1>Mercle tree</h1>
                            <input
                                className="treefield"
                                type="text"
                                ref="textInput"
                                placeholder="Type to update tree"
                            />
                            <input
                                className="treeblock"
                                type="number"
                                ref="blockSize"
                                placeholder="Type leaf block size"
                            />
                            <button className="updateTree" onClick={this.handleSubmit.bind(this)}>
                                Update tree
                            </button>
                        </header>
                        <ul>
                            <MercleTreeUI ref="tree" key={this.props.tree._id} mercleTree={this.props.tree} treeData={this.treeData} radius ={25} xDistance={25*1.5} yDistance={25*5}/>;
                        </ul>
                    </div>
                </ul>
            </div>
        );
    }
}


App.propTypes = {
    tree: PropTypes.object.isRequired,
};

export default createContainer(() => {
    return {
        tree: Tree,
    };
}, App);