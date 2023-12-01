import { Auth } from './Auth/auth.js'
import { User } from './User/user.js'
import { Queue } from '../Utilites/Queue.js'
import { Pixel } from '../Utilites/Pixel.js'

async function spotify() {
    await Auth.authenticate();

    const user = new User(Auth.token);
    const profile = await user.currentProfile();
    document.getElementById("username").innerText = profile.display_name;
    const tracks = await user.usersTopItems("tracks", "long_term");
    /*let imageStart = Math.floor(Math.random() * 19);*/
    let imageStart = 0;

    
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
    } else {
        textColor = "rgba(255, 255, 255, 1)";
    }

    document.documentElement.style.setProperty("--site-text-color", textColor);
    document.documentElement.style.setProperty("--home-canvas-border-color", textColor);
    let siteBackgroundColor = `radial-gradient(18% 28% at 24% 50%, rgba(${topColors.read(12).r}, ${topColors.read(12).g}, ${topColors.read(12).b}, 1) 7%, #073AFF00 100%),radial-gradient(18% 28% at 18% 71%, rgba(${topColors.read(10).r}, ${topColors.read(10).g}, ${topColors.read(10).b}, 1) 6%, #073AFF00 100%),
    radial-gradient(70% 53% at 36% 76%, rgba(${topColors.read(9).r}, ${topColors.read(9).g}, ${topColors.read(9).b}, 1) 0%, #073AFF00 100%),radial-gradient(42% 53% at 15% 94%, rgba(${topColors.read(8).r}, ${topColors.read(8).g}, ${topColors.read(8).b}, 1) 7%, #073AFF00 100%),
    radial-gradient(42% 53% at 34% 72%, rgba(${topColors.read(7).r}, ${topColors.read(7).g}, ${topColors.read(7).b}, 1) 7%, #073AFF00 100%),radial-gradient(18% 28% at 35% 87%, rgba(${topColors.read(6).r}, ${topColors.read(6).g}, ${topColors.read(6).b}, 1) 7%, #073AFF00 100%),
    radial-gradient(31% 43% at 7% 98%, rgba(${topColors.read(5).r}, ${topColors.read(5).g}, ${topColors.read(5).b}, 1) 24%, #073AFF00 100%),radial-gradient(21% 37% at 72% 23%, rgba(${topColors.read(4).r}, ${topColors.read(4).g}, ${topColors.read(4).b}, 1) 24%, #073AFF00 100%),
    radial-gradient(35% 56% at 91% 74%, rgba(${topColors.read(3).r}, ${topColors.read(3).g}, ${topColors.read(3).b}, 1) 9%, #073AFF00 100%),radial-gradient(74% 86% at 67% 38%, rgba(${topColors.read(2).r}, ${topColors.read(2).g}, ${topColors.read(2).b}, 1) 24%, #073AFF00 100%),
    linear-gradient(125deg,  rgba(${topColors.read(0).r}, ${topColors.read(0).g}, ${topColors.read(0).b}, 1) 1%,  rgba(${topColors.read(1).r}, ${topColors.read(1).g}, 
    ${topColors.read(1).b}, 1) 100%)`;
    document.documentElement.style.setProperty("--home-background-color", siteBackgroundColor);
    document.getElementById("home-gradient").style.background = `linear-gradient(180deg, rgba(${(topColors.read(0).r - 30)}, ${topColors.read(0).g - 30}, 
        ${topColors.read(0).b - 30}, 1) 14%, rgba(${topColors.read(0).r - 20}, ${topColors.read(0).g - 20}, ${topColors.read(0).b - 20}, 1) 33%, rgba(${topColors.read(0).r - 10}, 
        ${topColors.read(0).g - 10}, ${topColors.read(0).b - 10}, 0.9) 50%, rgba(${topColors.read(0).r}, ${topColors.read(0).g}, ${topColors.read(0).b}, 0.6) 66%, 
        rgba(${topColors.read(0).r + 10}, ${topColors.read(0).g + 10}, ${topColors.read(0).b + 10}, 0.00001) 85%)`;



    repeat();

    function repeat() {
        setTimeout(async () => {
            if (imageStart < tracks.items.length - 1) {
                imageStart++;
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
                } else {
                    textColor = "rgba(255, 255, 255, 1)";
                }

                document.documentElement.style.setProperty("--site-text-color", textColor);
                document.documentElement.style.setProperty("--home-canvas-border-color", textColor);
                let siteBackgroundColor = `radial-gradient(18% 28% at 24% 50%, rgba(${topColors.read(12).r}, ${topColors.read(12).g}, ${topColors.read(12).b}, 1) 7%, #073AFF00 100%),radial-gradient(18% 28% at 18% 71%, rgba(${topColors.read(10).r}, ${topColors.read(10).g}, ${topColors.read(10).b}, 1) 6%, #073AFF00 100%),
                radial-gradient(70% 53% at 36% 76%, rgba(${topColors.read(9).r}, ${topColors.read(9).g}, ${topColors.read(9).b}, 1) 0%, #073AFF00 100%),radial-gradient(42% 53% at 15% 94%, rgba(${topColors.read(8).r}, ${topColors.read(8).g}, ${topColors.read(8).b}, 1) 7%, #073AFF00 100%),
                radial-gradient(42% 53% at 34% 72%, rgba(${topColors.read(7).r}, ${topColors.read(7).g}, ${topColors.read(7).b}, 1) 7%, #073AFF00 100%),radial-gradient(18% 28% at 35% 87%, rgba(${topColors.read(6).r}, ${topColors.read(6).g}, ${topColors.read(6).b}, 1) 7%, #073AFF00 100%),
                radial-gradient(31% 43% at 7% 98%, rgba(${topColors.read(5).r}, ${topColors.read(5).g}, ${topColors.read(5).b}, 1) 24%, #073AFF00 100%),radial-gradient(21% 37% at 72% 23%, rgba(${topColors.read(4).r}, ${topColors.read(4).g}, ${topColors.read(4).b}, 1) 24%, #073AFF00 100%),
                radial-gradient(35% 56% at 91% 74%, rgba(${topColors.read(3).r}, ${topColors.read(3).g}, ${topColors.read(3).b}, 1) 9%, #073AFF00 100%),radial-gradient(74% 86% at 67% 38%, rgba(${topColors.read(2).r}, ${topColors.read(2).g}, ${topColors.read(2).b}, 1) 24%, #073AFF00 100%),
                linear-gradient(125deg,  rgba(${topColors.read(0).r}, ${topColors.read(0).g}, ${topColors.read(0).b}, 1) 1%,  rgba(${topColors.read(1).r}, ${topColors.read(1).g}, 
                ${topColors.read(1).b}, 1) 100%)`;
                document.documentElement.style.setProperty("--home-background-color", siteBackgroundColor);
                document.getElementById("home-gradient").style.background = `linear-gradient(180deg, rgba(${(topColors.read(0).r - 30)}, ${topColors.read(0).g - 30}, 
                    ${topColors.read(0).b - 30}, 1) 14%, rgba(${topColors.read(0).r - 20}, ${topColors.read(0).g - 20}, ${topColors.read(0).b - 20}, 1) 33%, rgba(${topColors.read(0).r - 10}, 
                    ${topColors.read(0).g - 10}, ${topColors.read(0).b - 10}, 0.9) 50%, rgba(${topColors.read(0).r}, ${topColors.read(0).g}, ${topColors.read(0).b}, 0.6) 66%, 
                    rgba(${topColors.read(0).r + 10}, ${topColors.read(0).g + 10}, ${topColors.read(0).b + 10}, 0.00001) 85%)`;


                repeat();
            }
        }, 4000);
    }

}



function grabImageColors(canvas: string, image) {
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
            resolve(topColors);
        }
    });
}

function setImage(canvasName, image, trackDescriptionId, trackName, artistDescriptionId, artistName) {

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
export { spotify }