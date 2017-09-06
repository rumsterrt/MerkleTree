import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { createContainer } from 'meteor/react-meteor-data';

import MercleTree from './MercleTree.jsx';

// App component - represents the whole app
const Tree = new MercleTree.constructor();

class App extends Component {
    constructor(props){
        super(props);
    }

    handleSubmit(event) {
        event.preventDefault();

        // Find the text field via the React ref
        const text = ReactDOM.findDOMNode(this.refs.textInput).value.trim();
        const size = parseInt(ReactDOM.findDOMNode(this.refs.blockSize).value.trim());

        console.log(text+"\n"+size);

        this.refs.tree.textData= text;
        this.refs.tree.blockSize= size;

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
                            <MercleTree ref="tree" key={this.props.tree._id} mercleTree={this.props.tree}/>;
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