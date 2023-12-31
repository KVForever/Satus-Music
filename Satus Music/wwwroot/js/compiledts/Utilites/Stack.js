class Stack {
    constructor(size) {
        this.storage = [];
        this.capacity = size;
    }
    push(item) {
        if (this.size() === this.capacity) {
            throw Error("Stack has reached max capacity, you cannot add more items");
        }
        this.storage.push(item);
    }
    pop() {
        return this.storage.pop();
    }
    peek(index) {
        return this.storage[index];
    }
    size() {
        return this.storage.length;
    }
}
export { Stack };
//# sourceMappingURL=Stack.js.map