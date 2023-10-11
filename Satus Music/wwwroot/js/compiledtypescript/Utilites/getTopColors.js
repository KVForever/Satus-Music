import { Queue } from '../Utilites/Queue.js';
import { Pixel } from '../Utilites/Pixel.js';
var a = 1;
function getTopColors(topTracks, colorContext, colorCanvas, grabColorImage, repeat) {
    let commonColor;
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
        let topColors = new Queue(20);
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
        commonColor = item;
        /*console.log(item, topColors);*/
        let checkColor = 0;
        notBadColor();
        function notBadColor() {
            if ((Math.abs(topColors.read(checkColor).r - topColors.read(checkColor).b) || 10 && Math.abs(topColors.read(checkColor).r - topColors.read(checkColor).g) >= 10) || Math.abs(topColors.read(checkColor).g - topColors.read(checkColor).b) >= 10) {
                commonColor.r = topColors.read(checkColor).r;
                commonColor.g = topColors.read(checkColor).g;
                commonColor.b = topColors.read(checkColor).b;
                return;
            }
            checkColor++;
            notBadColor();
        }
        document.getElementById("home-gradient").style.background = `linear-gradient(180deg, rgba(${commonColor.r - 30}, ${commonColor.g - 30}, ${commonColor.b - 30}, 1) 14%, rgba(${commonColor.r - 20}, ${commonColor.g - 20}, ${commonColor.b - 20}, 1) 33%, rgba(${commonColor.r - 10}, ${commonColor.g - 10}, ${commonColor.b - 10}, 0.9) 50%, rgba(${commonColor.r}, ${commonColor.g}, ${commonColor.b}, 0.6) 66%, rgba(${commonColor.r + 10}, ${commonColor.g + 10}, ${commonColor.b + 10}, 0.00001) 85%)`;
    };
    if (repeat == true) {
        setTimeout(() => {
            if (a < topTracks.items.length) {
                getTopColors(topTracks, colorContext, colorCanvas, grabColorImage, false);
                a++;
            }
        }, 4000);
    }
}
export { getTopColors };
//# sourceMappingURL=getTopColors.js.map