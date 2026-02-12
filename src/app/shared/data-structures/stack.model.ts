export class Stack<T> {
    private data: T[] = [];
    public get(): T {
        if(this.data.length == 0)
            return null;
        
        return this.data.shift();
    }

    public push(element: T): void {
        this.data.unshift(element);
    }

    public clear(): void {
        this.data.splice(0, this.data.length);
    }
}