import { Queue } from './Queue.js'
import { Pixel } from './Pixel.js'
//Grabs top colors in an image.
/*@params: canvas = name of the color canvas; 
           image(s) = what image you are checking; 
           imageStart = if there are multiple images what one to start with
*/
class Images {
    public static imageColors: Queue<Pixel>
   
    static grabImageColors(canvas: string, image) {
        return new Promise<Queue<Pixel>>((resolve) => {
            const colorCanvas = document.getElementById(canvas) as HTMLCanvasElement;
            const colorContext = colorCanvas.getContext("2d", { willReadFrequently: true });

            const sampleImage = image;
            let grabColorImage = new Image();
            grabColorImage.crossOrigin = "anonymous";
            grabColorImage.src = sampleImage.url;

            colorCanvas.width = sampleImage.width;
            colorCanvas.height = sampleImage.height;

            let mostCommonColor;
            let topColors = new Queue<Pixel>(20);
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

                let checkColors = new Array<Pixel>();
                for (var a = 0; a < topColors.size(); a++) {
                    checkColors.push(topColors.read(a));
                }
                mostCommonColor = item;
                for (var i = 0; i < topColors.size(); i++) {
                    let color = checkColors[i];
                    if ((Math.abs((color.r) - (color.b)) >= 15) && (Math.abs((color.r) - (color.g)) >= 15) && (Math.abs((color.g) - (color.b)) >= 15)) {
                        topColors.dequeue();
                    }
                    i++;
                }
                Images.imageColors = topColors;
                resolve(topColors);
            }
        });
    }

    static setImage(canvasName, image, trackDescriptionId, trackName, artistDescriptionId, artistName) {

        const canvas = document.getElementById(canvasName) as HTMLCanvasElement;
        const context = canvas.getContext("2d");
        let displayImage = image;
        let img = new Image();
        img.crossOrigin = "anonymous";
        img.src = displayImage.url;
        img.width = displayImage.width;
        img.height = displayImage.height;

        canvas.width = img.width;
        canvas.height = img.height;
        img.onload = function () {
            context.drawImage(img, 0, 0);
            document.getElementById(trackDescriptionId).textContent = trackName;
            document.getElementById(artistDescriptionId).innerText = artistName;
        };
    }
    static setArtistImage(canvasName, image, artistDescriptionId, artistName) {

        const canvas = document.getElementById(canvasName) as HTMLCanvasElement;
        const context = canvas.getContext("2d");
        let displayImage = image;
        let img = new Image();
        img.crossOrigin = "anonymous";
        img.src = displayImage.url;
        img.width = displayImage.width;
        img.height = displayImage.height;

        canvas.width = img.width;
        canvas.height = img.height;
        img.onload = function () {
            context.drawImage(img, 0, 0);
            document.getElementById(artistDescriptionId).innerText = artistName;
        };
    }
}

export { Images };