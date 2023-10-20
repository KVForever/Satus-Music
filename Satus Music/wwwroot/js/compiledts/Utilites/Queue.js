class Queue {
    constructor(capacity = Infinity) {
        this.capacity = capacity;
        this.storage = [];
    }
    enqueue(item) {
        if (this.size() === this.capacity) {
            throw Error("Queue has reached max capacity, you cannot add more items");
        }
        this.storage.push(item);
    }
    dequeue() {
        return this.storage.shift();
    }
    read(index) {
        return this.storage[index];
    }
    size() {
        return this.storage.length;
    }
}
export { Queue };
//# sourceMappingURL=Queue.js.map