export default class MercleNode{
    constructor(parent,type,key) {
            this.leftNode = null;
            this.rightNode = null;
            this.parent = parent;
            this.key = key;
            this.type = type;
    }

    childrenCount(){
        let result = 0;
        if (this.leftNode) {
            result += this.leftNode.childrenCount();
            result++;
        }
        if (this.rightNode) {
            result += this.rightNode.childrenCount();
            result++;
        }
        return result;
    }

    getHash() {
        var md5 = require('md5');

        if (this.rightNode && this.leftNode) {
            return md5(this.leftNode.getHash() + this.rightNode.getHash());
        } else {
            if(this.leftNode)
            {
                return this.leftNode.getHash();
            }
            if(this.rightNode)
            {
                return this.rightNode.getHash();
            }
            return md5(this.key);
        }
    }

    getLevel(){
        let result = 0;
        let parent = this.parent;
        while(parent){
            result++;
            parent = parent.parent;
        }
        return result;
    }

    getName(){
        let result = '';
        if(this.parent) {
            let recursive = (node) => {
                let refer = '';
                switch (node.type) {
                    case "left":
                        refer += '0';
                        break;
                    case "right":
                        refer += '1';
                        break;
                }
                if (node.parent && node.parent.type!='root') {
                    refer+='-';
                    return refer + recursive(node.parent);
                }else {
                    return refer;
                }
            }
            result = recursive(this).split("").reverse().join("");
        }else{
            result = 'Top';
        }
        return result;
    }
}