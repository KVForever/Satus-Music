import { Auth } from './auth.js';
import { User } from '../User/user.js';
import { Queue } from '../Utilites/Queue.js';
async function spotify() {
    await Auth.authenticate();
    const user = new User(Auth.token);
    const profile = await user.currentProfile();
    const topTracks = await user.usersTopItems("tracks");
    document.getElementById("display-name").innerText = profile.display_name;
    grabImageColors(topTracks, 5);
}
spotify();
var a = 1;
function grabImageColors(topTracks, imageNum) {
    document.getElementById("top-track-name").textContent = topTracks.items[imageNum].name;
    const canvas = document.getElementById("home-canvas");
    const context = canvas.getContext("2d");
    var displayImage = topTracks.items[imageNum].album.images[0];
    var img = new Image();
    img.crossOrigin = "anonymous";
    img.src = displayImage.url;
    img.width = displayImage.width;
    img.height = displayImage.height;
    canvas.width = img.width;
    canvas.height = img.height;
    const colorCanvas = document.getElementById("home-color-canvas");
    const colorContext = colorCanvas.getContext("2d", { willReadFrequently: true });
    const sampleImage = topTracks.items[imageNum].album.images[2];
    var grabColorImage = new Image();
    grabColorImage.crossOrigin = "anonymous";
    grabColorImage.src = sampleImage.url;
    colorCanvas.width = sampleImage.width;
    colorCanvas.height = sampleImage.height;
    let mostCommonColor, commonRed, commonGreen, commonBlue;
    img.onload = function () {
        context.drawImage(img, 0, 0);
    };
    grabColorImage.onload = function () {
        colorContext.drawImage(grabColorImage, 0, 0);
        const imgData = colorContext.getImageData(0, 0, colorCanvas.width, colorCanvas.height);
        let count = 0;
        const redArray = new Array(), greenArray = new Array, blueArray = new Array;
        let colors = [redArray, blueArray, greenArray];
        for (var a = 0; a < colors.length; a++) {
            for (var i = count; i < imgData.data.length / 3; i += 4) {
                colors[a].push(imgData.data[i]);
            }
            count++;
        }
        var limit = 3;
        const topRed = new Queue(limit);
        const topGreen = new Queue(limit);
        const topBlue = new Queue(limit);
        count = 0;
        let n = 0, mostfreq = 1, item;
        for (var c = 0; c < colors.length; c++) {
            for (var d = count; d < colors[c].length; d++) {
                for (var e = d; e < colors[c].length; e++) {
                    if (colors[c][d] == colors[c][e]) {
                        n++;
                        if (mostfreq < n) {
                            mostfreq = n;
                            if (count == 0) {
                                if (topRed.size() < limit) {
                                    topRed.enqueue(colors[c][d]);
                                }
                                else {
                                    topRed.dequeue();
                                    topRed.enqueue(colors[c][d]);
                                }
                            }
                            else if (count == 1) {
                                if (topGreen.size() < limit) {
                                    topGreen.enqueue(colors[c][d]);
                                }
                                else {
                                    topGreen.dequeue();
                                    topGreen.enqueue(colors[c][d]);
                                }
                            }
                            else {
                                if (topBlue.size() < limit) {
                                    topBlue.enqueue(colors[c][d]);
                                }
                                else {
                                    topBlue.dequeue();
                                    topBlue.enqueue(colors[c][d]);
                                }
                            }
                            item = colors[c][d];
                            if (count == 0) {
                                commonRed = colors[c][d];
                            }
                            else if (count == 1) {
                                commonGreen = colors[c][d];
                            }
                            else {
                                commonBlue = colors[c][d];
                            }
                        }
                    }
                }
                n = 0;
            }
            mostfreq = 1;
            count++;
            mostCommonColor = "rgba(" + commonRed + "," + commonGreen + "," + commonBlue + ")";
        }
        console.log(topRed, topGreen, topBlue);
        let checkColor;
        function notBadColor() {
            if ((commonRed == commonGreen && commonRed == commonBlue) || (Math.abs(commonRed - commonBlue) <= 10 && Math.abs(commonRed - commonGreen) <= 10)) {
                commonRed = topRed.read(checkColor);
                commonGreen = topGreen.read(checkColor);
                commonBlue = topBlue.read(checkColor);
                checkColor++;
                notBadColor();
            }
        }
        notBadColor();
        document.getElementById("home-gradient").style.background = `linear-gradient(180deg, rgba(${commonRed - 30}, ${commonGreen - 30}, ${commonBlue - 30}, 1) 14%, rgba(${commonRed - 20}, ${commonGreen - 20}, ${commonBlue - 20}, 1) 33%, rgba(${commonRed - 10}, ${commonGreen - 10}, ${commonBlue - 10}, 0.9) 50%, rgba(${commonRed}, ${commonGreen}, ${commonBlue}, 0.6) 66%, rgba(${commonRed + 10}, ${commonGreen + 10}, ${commonBlue + 10}, 0.00001) 85%)`;
    };
    //setTimeout(() => {
    //    grabImageColors(topTracks, a);
    //    if (a < topTracks.items.length) {
    //        a++;
    //    }
    //}, 4000);
}
//# sourceMappingURL=spotify.js.map