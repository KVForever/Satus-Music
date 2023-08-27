import { Auth } from './auth.js'
import { Track } from '../Tracks/track.js'
import { User } from '../User/user.js'
import { Queue } from '../Utilites/Queue.js'
import { Pixel } from '../Utilites/Pixel.js'
async function spotify() {
    await Auth.authenticate();

    const user = new User(Auth.token);
    const profile = await user.currentProfile();
    const topTracks = await user.usersTopItems("tracks", "long_term");

    document.getElementById("display-name").innerText = profile.display_name;
    
    grabImageColors(topTracks, 0, true);
    
}

spotify();

var a = 1;
function grabImageColors(topTracks, imageNum: number, repeat: boolean) {

    document.getElementById("top-track-name").textContent = topTracks.items[imageNum].name;
    document.getElementById("top-track-artist-name").innerText = topTracks.items[imageNum].artists[0].name
    const canvas = document.getElementById("home-canvas") as HTMLCanvasElement;
    const context = canvas.getContext("2d");
    let displayImage = topTracks.items[imageNum].album.images[0];
    let img = new Image();
    img.crossOrigin = "anonymous";
    img.src = displayImage.url;
    img.width = displayImage.width;
    img.height = displayImage.height;

    canvas.width = img.width;
    canvas.height = img.height;

    const colorCanvas = document.getElementById("home-color-canvas") as HTMLCanvasElement;
    const colorContext = colorCanvas.getContext("2d", {willReadFrequently: true});

    const sampleImage = topTracks.items[imageNum].album.images[2];
    let grabColorImage = new Image();
    grabColorImage.crossOrigin = "anonymous";
    grabColorImage.src = sampleImage.url;

    colorCanvas.width = sampleImage.width;
    colorCanvas.height = sampleImage.height;

    let mostCommonColor;
    img.onload = function () {
        context.drawImage(img, 0, 0);
    };

    grabColorImage.onload = function () {
        colorContext.drawImage(grabColorImage, 0, 0);
        const imgData = colorContext.getImageData(0, 0, colorCanvas.width, colorCanvas.height);
        
        let numPixels = 0;
        let pixelMap = new Map();
        for (var a = 0; a < imgData.data.length; a += 4) {
            let r = imgData.data[a];
            let g = imgData.data[a + 1];
            let  b = imgData.data[a + 2];
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
        let checkColor = 0;
        notBadColor();
        function notBadColor() {
            if ((Math.abs(topColors.read(checkColor).r - topColors.read(checkColor).b) || 10 && Math.abs(topColors.read(checkColor).r - topColors.read(checkColor).g) >= 10) || Math.abs(topColors.read(checkColor).g - topColors.read(checkColor).b) >= 10) {
                mostCommonColor.r = topColors.read(checkColor).r;
                mostCommonColor.g = topColors.read(checkColor).g;
                mostCommonColor.b = topColors.read(checkColor).b;
                return;
            }
            checkColor++;
            notBadColor();
        }
        document.getElementById("home-gradient").style.background = `linear-gradient(180deg, rgba(${mostCommonColor.r - 30}, ${mostCommonColor.g - 30}, ${mostCommonColor.b - 30}, 1) 14%, rgba(${mostCommonColor.r - 20}, ${mostCommonColor.g - 20}, ${mostCommonColor.b - 20}, 1) 33%, rgba(${mostCommonColor.r - 10}, ${mostCommonColor.g - 10}, ${mostCommonColor.b - 10}, 0.9) 50%, rgba(${mostCommonColor.r}, ${mostCommonColor.g}, ${mostCommonColor.b}, 0.6) 66%, rgba(${mostCommonColor.r + 10}, ${mostCommonColor.g + 10}, ${mostCommonColor.b + 10}, 0.00001) 85%)`;
       
    }
    if (repeat == true) {
        setTimeout(() => {
        
            if (a < topTracks.items.length) {
                grabImageColors(topTracks, a, repeat);
                a++;
            }
        }, 4000);
    }
    
}
