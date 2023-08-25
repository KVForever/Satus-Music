class Stack<T>
{
    private storage: T[] = [];
    private capacity: number;
    constructor(size: number) {
       this.capacity = size;
    }

    push(item: T): void {
        if(this.size() === this.capacity) {
            throw Error("Stack has reached max capacity, you cannot add more items");
        }
        this.storage.push(item);
    }

    pop(): T | undefined {
        
        return this.storage.pop();
    }

    peek(index: number): T | undefined {
        return this.storage[index];
    }

    size(): number {
        return this.storage.length;
    }

}

export { Stack }