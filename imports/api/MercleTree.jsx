import React, { Component, PropTypes } from 'react';
import MercleNode from '../api/MercleNode.jsx';

// Tree component - represents a single tree

export default class MercleTree{
    constructor(data,blockSize) {
        this.rootNode = null;

        if(!blockSize || blockSize<=0)
        {
            blockSize = 20;
        }

        if (data) {
            let j = 0;
            let array = new Array();
            let leafArray = new Array();
            for (let i = 0; i < data.length; i++) {
                j = Math.floor(i / blockSize);
                if (array[j]) {
                    array[j] += data[i];
                } else {
                    array[j] = data[i];
                    if (j > 0) {
                        leafArray.push(new MercleNode(null, leafArray.length % 2 == 0 ? "left" : "right", array[j - 1]));
                    }
                }
            }
            leafArray.push(new MercleNode(null, leafArray.length % 2 == 0 ? "left" : "right", array[j]));

            this.rootNode = this.createLevel(leafArray);
        }
    }

    createLevel(data) {
        let leafArray = new Array();
        for (let i = 0; i < data.length; i += 2) {
            let keyData = data[i].key;
            if (data[i + 1]) {
                keyData += data[i + 1].key;
            }
            leafArray.push(new MercleNode(null, leafArray.length % 2 == 0 ? "left" : "right", keyData));
            leafArray[leafArray.length - 1].leftNode = data[i];
            data[i].parent = leafArray[leafArray.length - 1];
            if (data[i + 1]) {
                leafArray[leafArray.length - 1].rightNode = data[i + 1];
                data[i + 1].parent = leafArray[leafArray.length - 1];
            }
        }

        if (leafArray.length > 1) {
            return this.createLevel(leafArray);
        } else {
            leafArray[0].type = "root";
            return leafArray[0];
        }
    }
}