import { Auth } from './Auth/auth.js';
import { User } from './User/user.js';
import { Queue } from '../Utilites/Queue.js';
import { Pixel } from '../Utilites/Pixel.js';
async function spotify() {
    await Auth.authenticate();
    const user = new User(Auth.token);
    const profile = await user.currentProfile();
    const tracks = await user.usersTopItems("tracks", "long_term");
    let imageStart = 0;
    grabImageColors("home-color-canvas", tracks, imageStart);
    document.getElementById("username").innerText = profile.display_name;
    document.getElementById("top-track-name").textContent = tracks.items[imageStart].name;
    document.getElementById("top-track-artist-name").innerText = tracks.items[imageStart].artists[0].name;
    grabImageColors("home-color-canvas", tracks, imageStart);
    const canvas = document.getElementById("home-canvas");
    const context = canvas.getContext("2d");
    let displayImage = tracks.items[imageStart].album.images[0];
    let img = new Image();
    img.crossOrigin = "anonymous";
    img.src = displayImage.url;
    img.width = displayImage.width;
    img.height = displayImage.height;
    canvas.width = img.width;
    canvas.height = img.height;
    img.onload = function () {
        context.drawImage(img, 0, 0);
    };
    repeat();
    function repeat() {
        setTimeout(() => {
            if (imageStart < tracks.items.length) {
                imageStart++;
                document.getElementById("username").innerText = profile.display_name;
                document.getElementById("top-track-name").textContent = tracks.items[imageStart].name;
                document.getElementById("top-track-artist-name").innerText = tracks.items[imageStart].artists[0].name;
                let topColors = grabImageColors("home-color-canvas", tracks, imageStart);
                document.getElementById("home-gradient").style.background = `linear-gradient(180deg, rgba(${topColors[1].r - 30}, ${topColors[1].g - 30}, ${topColors[1].b - 30}, 1) 14%, rgba(${topColors[1].r - 20}, ${topColors[1].g - 20}, ${topColors[1].b - 20}, 1) 33%, rgba(${topColors[1].r - 10}, ${topColors[1].g - 10}, ${topColors[1].b - 10}, 0.9) 50%, rgba(${topColors[1].r}, ${topColors[1].g}, ${topColors[1].b}, 0.6) 66%, rgba(${topColors[1].r + 10}, ${topColors[1].g + 10}, ${topColors[1].b + 10}, 0.00001) 85%)`;
                document.getElementById("home-background").style.backgroundColor = `rgba(${topColors[1].r},${topColors[1].g},${topColors[1].b}, 1)`;
                const canvas = document.getElementById("home-canvas");
                const context = canvas.getContext("2d");
                let displayImage = tracks.items[imageStart].album.images[0];
                let img = new Image();
                img.crossOrigin = "anonymous";
                img.src = displayImage.url;
                img.width = displayImage.width;
                img.height = displayImage.height;
                canvas.width = img.width;
                canvas.height = img.height;
                img.onload = function () {
                    context.drawImage(img, 0, 0);
                };
                repeat();
            }
        }, 4000);
    }
}
function grabImageColors(canvas, tracks, imageStart, repeat) {
    const colorCanvas = document.getElementById(canvas);
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
        mostCommonColor = item;
        console.log(item, topColors);
        let checkColor = topColors.size();
        notBadColor();
        function notBadColor() {
            if (checkColor >= 0) {
                if ((Math.abs((topColors.read(checkColor).r) - (topColors.read(checkColor).b)) >= 10) && (Math.abs((topColors.read(checkColor).r) - (topColors.read(checkColor).g)) >= 10) && (Math.abs((topColors.read(checkColor).g) - (topColors.read(checkColor).b)) >= 10)) {
                    mostCommonColor = topColors.dequeue();
                }
                checkColor--;
                notBadColor();
            }
            else {
                return topColors;
            }
        }
    };
}
export { spotify };
//# sourceMappingURL=spotify.js.map