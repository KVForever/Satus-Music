import { Node } from './Node';
class LinkedList {
    constructor() {
        this.head = null;
    }
    addInBegin(data) {
        const node = new Node(data);
        if (!this.head) {
            this.head = node;
        }
        else {
            this.head.prev = node;
            node.next = this.head;
            this.head = node;
        }
        return node;
    }
    addAtEnd(data) {
        const node = new Node(data);
        if (!this.head) {
            this.head = node;
        }
        else {
            const getLast = (node) => {
                return node.next ? getLast(node.next) : node;
            };
            const lastNode = getLast(this.head);
            node.prev = lastNode;
            lastNode.next = node;
        }
        return node;
    }
    delete(node) {
        if (!node.prev) {
            this.head = node.next;
        }
        else {
            const prevNode = node.prev;
            prevNode.next = node.next;
        }
    }
    traverse() {
        const array = [];
        if (!this.head) {
            return array;
        }
        const addToArray = (node) => {
            array.push(node.data);
            return node.next ? addToArray(node.next) : array;
        };
        return addToArray(this.head);
    }
    search(comparator) {
        const checkNext = (node) => {
            if (comparator(node.data)) {
                return node;
            }
            return node.next ? checkNext(node.next) : null;
        };
        return this.head ? checkNext(this.head) : null;
    }
}
export { LinkedList };
//# sourceMappingURL=LinkedList.js.map