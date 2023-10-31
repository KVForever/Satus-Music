import { Auth } from './Auth/auth.js';
import { User } from './User/user.js';
import { Queue } from '../Utilites/Queue.js';
import { Pixel } from '../Utilites/Pixel.js';
async function spotify() {
    await Auth.authenticate();
    const user = new User(Auth.token);
    const profile = await user.currentProfile();
    document.getElementById("username").innerText = profile.display_name;
    const tracks = await user.usersTopItems("tracks", "short_term");
    let imageStart = Math.floor(Math.random() * 19);
    let trackOne = tracks.items[0].album.images[0];
    let trackOneName = tracks.items[0].artists[0].name;
    let trackOneArtist = tracks.items[0].name;
    let trackTwo = tracks.items[1].album.images[0];
    let trackTwoName = tracks.items[1].artists[0].name;
    let trackTwoArtist = tracks.items[1].name;
    let trackThree = tracks.items[2].album.images[0];
    let trackThreeName = tracks.items[2].artists[0].name;
    let trackThreeArtist = tracks.items[2].name;
    setImage("top-song-one", trackOne, "top-song-one-name", trackOneName, "top-song-one-artist-name", trackOneArtist);
    setImage("top-song-two", trackTwo, "top-song-two-name", trackTwoName, "top-song-two-artist-name", trackTwoArtist);
    setImage("top-song-three", trackThree, "top-song-three-name", trackThreeName, "top-song-three-artist-name", trackThreeArtist);
    let displayImage = tracks.items[imageStart].album.images[0];
    let colorImage = tracks.items[imageStart].album.images[2];
    let track = tracks.items[imageStart].artists[0].name;
    let artist = tracks.items[imageStart].name;
    setImage("home-canvas", displayImage, "top-track-name", track, "top-track-artist-name", artist);
    let topColors = await grabImageColors("home-color-canvas", colorImage);
    //If the color is closer to white set text to black do the opposite of the opposite is true. They are multiplied because humans percive color and litness differently 
    let textColor;
    let r = topColors.read(0).r * .3;
    let g = topColors.read(0).g * .59;
    let b = topColors.read(0).b * .11;
    let grayScaleColor = r + g + b;
    if (grayScaleColor > 128) {
        textColor = "rgba(0, 0, 0, 1)";
    }
    else {
        textColor = "rgba(255, 255, 255, 1)";
    }
    document.documentElement.style.setProperty("--site-text-color", textColor);
    document.documentElement.style.setProperty("--home-canvas-border-color", textColor);
    document.getElementById("home-gradient").style.background = `linear-gradient(180deg, rgba(${(topColors.read(0).r - 30)}, ${topColors.read(0).g - 30}, 
        ${topColors.read(0).b - 30}, 1) 14%, rgba(${topColors.read(0).r - 20}, ${topColors.read(0).g - 20}, ${topColors.read(0).b - 20}, 1) 33%, rgba(${topColors.read(0).r - 10}, 
        ${topColors.read(0).g - 10}, ${topColors.read(0).b - 10}, 0.9) 50%, rgba(${topColors.read(0).r}, ${topColors.read(0).g}, ${topColors.read(0).b}, 0.6) 66%, 
        rgba(${topColors.read(0).r + 10}, ${topColors.read(0).g + 10}, ${topColors.read(0).b + 10}, 0.00001) 85%)`;
    let siteBackgroundColor = `rgba(${topColors.read(0).r},${topColors.read(0).g},${topColors.read(0).b}, 1)`;
    document.documentElement.style.setProperty("--site-background-color", siteBackgroundColor);
    /*    repeat();*/
    //function repeat() {
    //    setTimeout(async () => {
    //        if (imageStart < tracks.items.length - 1) {
    //            imageStart++;               
    //                let displayImage = tracks.items[imageStart].album.images[0];
    //                let colorImage = tracks.items[imageStart].album.images[2];
    //                let track = tracks.items[imageStart].artists[0].name;
    //                let artist = tracks.items[imageStart].name;
    //                setImage("home-canvas", displayImage, "top-track-artist-name", track, "top-track-name", artist);
    //                let topColors = await grabImageColors("home-color-canvas", colorImage);
    //                //inverte top color, grayscale, and check if closer to black or white
    //                let textColor;
    //                let r = (255 - (topColors.read(0).r)) * .3;
    //                let g = (255 - (topColors.read(0).g)) * .59;
    //                let b = (255 - (topColors.read(0).b)) * .11;
    //                let grayScaleColor = r + g + b;
    //                if (grayScaleColor > 128) {
    //                    textColor = "rgba(255, 255, 255, 1)";
    //                } else {
    //                    textColor = "rgba(0, 0, 0, 1)";
    //                }
    //                document.documentElement.style.setProperty("--site-text-color", textColor)
    //                document.documentElement.style.setProperty("--home-canvas-border-color", textColor);
    //                document.getElementById("home-gradient").style.background = `linear-gradient(180deg, rgba(${(topColors.read(0).r - 30)}, ${topColors.read(0).g - 30}, 
    //                    ${topColors.read(0).b - 30}, 1) 14%, rgba(${topColors.read(0).r - 20}, ${topColors.read(0).g - 20}, ${topColors.read(0).b - 20}, 1) 33%, rgba(${topColors.read(0).r - 10}, 
    //                    ${topColors.read(0).g - 10}, ${topColors.read(0).b - 10}, 0.9) 50%, rgba(${topColors.read(0).r}, ${topColors.read(0).g}, ${topColors.read(0).b}, 0.6) 66%, 
    //                    rgba(${topColors.read(0).r + 10}, ${topColors.read(0).g + 10}, ${topColors.read(0).b + 10}, 0.00001) 85%)`;
    //                document.getElementById("home-background").style.backgroundColor = `rgba(${topColors.read(0).r},${topColors.read(0).g},${topColors.read(0).b}, 1)`;
    //                repeat();
    //            }
    //    }, 4000);
    //}
}
function setImage(canvasName, image, trackDescriptionId, trackName, artistDescriptionId, artistName) {
    const canvas = document.getElementById(canvasName);
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
function grabImageColors(canvas, image) {
    return new Promise((resolve) => {
        const colorCanvas = document.getElementById(canvas);
        const colorContext = colorCanvas.getContext("2d", { willReadFrequently: true });
        const sampleImage = image;
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
                if ((Math.abs((color.r) - (color.b)) >= 15) && (Math.abs((color.r) - (color.g)) >= 15) && (Math.abs((color.g) - (color.b)) >= 15)) {
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