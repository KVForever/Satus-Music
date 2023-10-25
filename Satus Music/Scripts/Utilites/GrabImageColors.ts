import { Queue } from './Queue.js'
import { Pixel } from './Pixel.js'
//Grabs top colors in an image.
/*@params: canvas = name of the color canvas; 
           image(s) = what image you are checking; 
           imageStart = if there are multiple images what one to start with
*/
function grabImageColors(canvas: string, tracks, imageStart: number) {

    const colorCanvas = document.getElementById(canvas) as HTMLCanvasElement;
    const colorContext = colorCanvas.getContext("2d", { willReadFrequently: true });

    const sampleImage = tracks.items[imageStart].album.images[2];
    let grabColorImage = new Image();
    grabColorImage.crossOrigin = "anonymous";
    grabColorImage.src = sampleImage.url;

    colorCanvas.width = sampleImage.width;
    colorCanvas.height = sampleImage.height;

    let mostCommonColor;

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
        let topColors = new Queue<Pixel>(20);
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
        mostCommonColor = item;
        console.log(item, topColors);
        let checkColor = topColors.size();
        notBadColor();
        function notBadColor() {
            if (checkColor >= 0) {
                if ((Math.abs((topColors.read(checkColor).r) - (topColors.read(checkColor).b)) >= 10) && (Math.abs((topColors.read(checkColor).r) - (topColors.read(checkColor).g)) >= 10) && (Math.abs((topColors.read(checkColor).g) - (topColors.read(checkColor).b)) >= 10)) {
                    mostCommonColor = topColors.dequeue();
                    //mostCommonColor.r = topColors.read(checkColor).r;
                    //mostCommonColor.g = topColors.read(checkColor).g;
                    //mostCommonColor.b = topColors.read(checkColor).b;
                    //return;
                }
                checkColor--;
                notBadColor();
            } else {
                return topColors;
            }
        }
        //return topColors;
        //document.getElementById("home-gradient").style.background = `linear-gradient(180deg, rgba(${mostCommonColor.r - 30}, ${mostCommonColor.g - 30}, ${mostCommonColor.b - 30}, 1) 14%, rgba(${mostCommonColor.r - 20}, ${mostCommonColor.g - 20}, ${mostCommonColor.b - 20}, 1) 33%, rgba(${mostCommonColor.r - 10}, ${mostCommonColor.g - 10}, ${mostCommonColor.b - 10}, 0.9) 50%, rgba(${mostCommonColor.r}, ${mostCommonColor.g}, ${mostCommonColor.b}, 0.6) 66%, rgba(${mostCommonColor.r + 10}, ${mostCommonColor.g + 10}, ${mostCommonColor.b + 10}, 0.00001) 85%)`;
        //document.getElementById("home-background").style.backgroundColor = `rgba(${mostCommonColor.r},${mostCommonColor.g},${mostCommonColor.b}, 1)`;
        //document.getElementById("home-greeting").style.backgroundImage = `linear-gradient(180deg, rgba(${mostCommonColor.r - 30}, ${mostCommonColor.g - 30}, ${mostCommonColor.b - 30}, 1) 14%, rgba(${mostCommonColor.r - 20}, ${mostCommonColor.g - 20}, ${mostCommonColor.b - 20}, 1) 33%, rgba(${mostCommonColor.r - 10}, ${mostCommonColor.g - 10}, ${mostCommonColor.b - 10}, 0.9) 50%, rgba(${mostCommonColor.r}, ${mostCommonColor.g}, ${mostCommonColor.b}, 0.6) 66%, rgba(${mostCommonColor.r + 10}, ${mostCommonColor.g + 10}, ${mostCommonColor.b + 10}, 0.00001) 85%)`;
    }
}
export { grabImageColors };