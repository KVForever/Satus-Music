import { Queue } from './Queue.js';
import { Pixel } from './Pixel.js';
//Grabs top colors in an image.
/*@params: canvas = name of the color canvas;
           image(s) = what image you are checking;
           imageStart = if there are multiple images what one to start with
*/
function grabImageColors(canvas, tracks, imageStart) {
    return new Promise((resolve) => {
        const colorCanvas = document.getElementById(canvas);
        const colorContext = colorCanvas.getContext("2d", { willReadFrequently: true });
        const sampleImage = tracks.items[imageStart].album.images[2];
        let grabColorImage = new Image();
        grabColorImage.crossOrigin = "anonymous";
        grabColorImage.src = sampleImage.url;
        colorCanvas.width = sampleImage.width;
        colorCanvas.height = sampleImage.height;
        let mostCommonColor;
        let topColors = new Queue(20);
        grabColorImage.onload = function () {
            colorContext.drawImage(grabColorImage, 0, 0);
            const imgData = colorContext.getImageData(0, 0, colorCanvas.width, colorCanvas.height);
            let numPixels = 0;
            let pixelMap = new Map();
            for (var a = 0; a < imgData.data.length; a += 4) {
                let r = imgData.data[a];
                let g = imgData.data[a + 1];
                let b = imgData.data[a + 2];
                let pixelToAdd = new Pixel(r, g, b);
                pixelMap.set(numPixels, pixelToAdd);
                numPixels++;
            }
            let n = 0, mostFreq = 1, item;
            for (var d = 0; d < pixelMap.size; d++) {
                for (var e = d; e < pixelMap.size; e++) {
                    if (pixelMap.get(e) == pixelMap.get(d)) {
                        n++;
                        if (mostFreq < n) {
                            mostFreq = n;
                            let newGreatest = pixelMap.get(d);
                            if (topColors.size() < 20) {
                                topColors.enqueue(pixelMap.get(d));
                            }
                            else {
                                topColors.dequeue();
                                topColors.enqueue(pixelMap.get(d));
                            }
                            item = newGreatest;
                            n = 0;
                        }
                    }
                }
            }
            let checkColors = new Array();
            for (var a = 0; a < topColors.size(); a++) {
                checkColors.push(topColors.read(a));
            }
            mostCommonColor = item;
            for (var i = 0; i < topColors.size(); i++) {
                let color = checkColors[i];
                if ((Math.abs((color.r) - (color.b)) <= 10) && (Math.abs((color.r) - (color.g)) <= 10) && (Math.abs((color.g) - (color.b)) <= 10)) {
                    topColors.dequeue();
                }
                i++;
            }
            console.log(topColors);
            resolve(topColors);
        };
    });
}
export { grabImageColors };
//# sourceMappingURL=GrabImageColors.js.map