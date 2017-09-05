import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { createContainer } from 'meteor/react-meteor-data';

import BinaryTree from './BinaryTree.jsx';

// App component - represents the whole app

class App extends Component {
    constructor(props){
        super(props);
    }

    render() {
        return (
            <div className="container">
                <ul>
                    <div className="container">
                        <header>
                            <h1>Binary tree</h1>
                        </header>
                        <ul>
                            <BinaryTree key={this.props.tree._id} binaryTree={this.props.tree}/>;
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
        tree: new BinaryTree.constructor()
    };
}, App);