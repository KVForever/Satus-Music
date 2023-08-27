class Pixel {
    constructor(num1, num2, num3) {
        this.setPixel(num1, num2, num3);
    }
    setPixel(num1, num2, num3) {
        this.r = num1;
        this.g = num2;
        this.b = num3;
    }
    getPixel() {
        return `(${this.r}, ${this.g}, ${this.b}, 1)`;
    }
}
export { Pixel };
//# sourceMappingURL=Pixel.js.map