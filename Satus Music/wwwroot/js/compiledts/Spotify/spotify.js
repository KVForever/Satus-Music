import { Auth } from './Auth/auth.js';
import { User } from './User/user.js';
import { Queue } from '../Utilites/Queue.js';
import { Pixel } from '../Utilites/Pixel.js';
async function spotify() {
    await Auth.authenticate();
    const user = new User(Auth.token);
    const profile = await user.currentProfile();
    const tracks = await user.usersTopItems("tracks", "long_term");
    let imageStart = 4;
    grabImageColors("home-color-canvas", tracks, imageStart)
        .then((topColors) => {
        // Here, topColors is available after the image has loaded and processing is complete.
        document.getElementById("home-gradient").style.background = `linear-gradient(180deg, rgba(${(topColors.read(0).r - 30)}, ${topColors.read(0).g - 30}, ${topColors.read(0).b - 30}, 1) 14%, rgba(${topColors.read(0).r - 20}, ${topColors.read(0).g - 20}, ${topColors.read(0).b - 20}, 1) 33%, rgba(${topColors.read(0).r - 10}, ${topColors.read(0).g - 10}, ${topColors.read(0).b - 10}, 0.9) 50%, rgba(${topColors.read(0).r}, ${topColors.read(0).g}, ${topColors.read(0).b}, 0.6) 66%, rgba(${topColors.read(0).r + 10}, ${topColors.read(0).g + 10}, ${topColors.read(0).b + 10}, 0.00001) 85%)`;
        document.getElementById("home-background").style.backgroundColor = `rgba(${topColors.read(0).r},${topColors.read(0).g},${topColors.read(0).b}, 1)`;
        document.getElementById("username").innerText = profile.display_name;
        document.getElementById("top-track-name").textContent = tracks.items[imageStart].name;
        document.getElementById("top-track-artist-name").innerText = tracks.items[imageStart].artists[0].name;
    })
        .catch((error) => {
        console.error("Error:", error);
    });
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
    /*    repeat();*/
    function repeat() {
        setTimeout(async () => {
            if (imageStart < tracks.items.length) {
                imageStart++;
                document.getElementById("username").innerText = profile.display_name;
                document.getElementById("top-track-name").textContent = tracks.items[imageStart].name;
                document.getElementById("top-track-artist-name").innerText = tracks.items[imageStart].artists[0].name;
                grabImageColors("home-color-canvas", tracks, imageStart)
                    .then((topColors) => {
                    // Here, topColors is available after the image has loaded and processing is complete.
                    document.getElementById("home-gradient").style.background = `linear-gradient(180deg, rgba(${(topColors.read(0).r - 30)}, ${topColors.read(0).g - 30}, ${topColors.read(0).b - 30}, 1) 14%, rgba(${topColors.read(0).r - 20}, ${topColors.read(0).g - 20}, ${topColors.read(0).b - 20}, 1) 33%, rgba(${topColors.read(0).r - 10}, ${topColors.read(0).g - 10}, ${topColors.read(0).b - 10}, 0.9) 50%, rgba(${topColors.read(0).r}, ${topColors.read(0).g}, ${topColors.read(0).b}, 0.6) 66%, rgba(${topColors.read(0).r + 10}, ${topColors.read(0).g + 10}, ${topColors.read(0).b + 10}, 0.00001) 85%)`;
                    document.getElementById("home-background").style.backgroundColor = `rgba(${topColors.read(0).r},${topColors.read(0).g},${topColors.read(0).b}, 1)`;
                    document.getElementById("username").innerText = profile.display_name;
                    document.getElementById("top-track-name").textContent = tracks.items[imageStart].name;
                    document.getElementById("top-track-artist-name").innerText = tracks.items[imageStart].artists[0].name;
                })
                    .catch((error) => {
                    console.error("Error:", error);
                });
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
            console.log(topColors);
            let checkColors = new Array(20);
            for (var a = 0; a < topColors.size(); a++) {
                checkColors.push(topColors.read(i));
            }
            mostCommonColor = item;
            for (var i = 0; i < topColors.size(); i++) {
                if ((Math.abs((checkColors[i].r) - (checkColors[i].b)) <= 10) && (Math.abs((checkColors[i].r) - (checkColors[i].g)) <= 10) && (Math.abs((checkColors[i].g) - (checkColors[i].b)) <= 10)) {
                    topColors.dequeue();
                }
                i++;
            }
            console.log(topColors);
            resolve(topColors);
        };
    });
}
export { spotify };
//# sourceMappingURL=spotify.js.map