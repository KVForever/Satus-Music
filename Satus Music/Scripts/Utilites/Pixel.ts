class Pixel {
    r: number;
    g: number;
    b: number;
    constructor(num1: number, num2: number, num3: number) {
        this.setPixel(num1, num2, num3);
    }

    private setPixel(num1: number, num2: number, num3: number): void {
        this.r = num1;
        this.g = num2;
        this.b = num3;
    }

    public getPixel() {
        return `(${this.r}, ${this.g}, ${this.b}, 1)`
    }
}

export { Pixel }