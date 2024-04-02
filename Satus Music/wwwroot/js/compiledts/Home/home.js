import { Auth } from '../Spotify/Auth/auth.js';
import { User } from '../Spotify/User/user.js';
import { Images } from '../Utilites/Images.js';
import { Track } from '../Spotify/Tracks/track.js';
const token = localStorage.getItem("access_token");
const refresh = localStorage.getItem("refreshTime");
const currentTime = new Date().getTime() / 1000;
var user;
var track;
if (currentTime > Number(refresh)) {
    Auth.authenticate;
    user = new User(Auth.token);
    track = new Track(Auth.token);
}
else {
}
user = new User(token);
track = new Track(token);
const profile = await user.currentProfile();
document.getElementById("username").innerText = profile.display_name;
const songs = await user.usersTopItems("tracks", "short_term");
const artists = await user.usersTopItems("artists", "short_term");
/* let imageStart = Math.floor(Math.random() * 19);*/
let imageStart = 0;
/*get initial image information.*/
let displayImage = songs.items[imageStart].album.images[0];
let colorImage = songs.items[imageStart].album.images[2];
let song = songs.items[imageStart].artists[0].name;
let artist = songs.items[imageStart].name;
/*set the image and desription.*/
Images.setImageWithDescription("home-canvas", displayImage, "top-track-name", song, "top-track-artist-name", artist);
/*grab initial image colors.*/
let topColors = await Images.grabImageColors("home-color-canvas", colorImage);
/*set the text to black or white*/
var textColor = blackOrWhite(topColors);
document.documentElement.style.setProperty("--site-text-color", textColor);
document.documentElement.style.setProperty("--home-canvas-border-color", textColor);
/*set initial background colors*/
let siteBackgroundColor = `radial-gradient(18% 28% at 24% 50%, rgba(${topColors[12]}, 1) 7%, #073AFF00 100%),radial-gradient(18% 28% at 18% 71%, rgba(${topColors[10]}, 1) 6%, #073AFF00 100%),
radial-gradient(70% 53% at 36% 76%, rgba(${topColors[9]}, 1) 0%, #073AFF00 100%),radial-gradient(42% 53% at 15% 94%, rgba(${topColors[8]}, 1) 7%, #073AFF00 100%),
radial-gradient(42% 53% at 34% 72%, rgba(${topColors[7]}, 1) 7%, #073AFF00 100%),radial-gradient(18% 28% at 35% 87%, rgba(${topColors[6]}, 1) 7%, #073AFF00 100%),
radial-gradient(31% 43% at 7% 98%, rgba(${topColors[5]}, 1) 24%, #073AFF00 100%),radial-gradient(21% 37% at 72% 23%, rgba(${topColors[4]}, 1) 24%, #073AFF00 100%),
radial-gradient(35% 56% at 91% 74%, rgba(${topColors[3]}, 1) 9%, #073AFF00 100%),radial-gradient(74% 86% at 67% 38%, rgba(${topColors[2]}, 1) 24%, #073AFF00 100%),
linear-gradient(125deg,  rgba(${topColors[0]}, 1) 1%,  rgba(${topColors[1]}, 1) 100%)`;
document.documentElement.style.setProperty("--home-background-color", siteBackgroundColor);
document.getElementById("greeting-background").style.background = `linear-gradient(180deg, rgba(${topColors[0]}, 1) 14%, rgba(${topColors[0]}, 1) 33%, rgba(${topColors[0]}, 0.9) 50%, rgba(${topColors[0]}, ${topColors[0]}, 0.00001) 85%)`;
/*repeate getting image, setting image and information, getting image colors, and setting background colors.*/
repeat();
//use users top songs that I got at the start and set a few canvases with the song image along with getting the descripiton and some other information about the song.
for (let i = 0; i < songs.items.length / 2; i++) {
    let trackImage = songs.items[i].album.images[0];
    let trackColorImage = songs.items[i].album.images[2];
    let trackName = songs.items[i].artists[0].name;
    let trackArtist = songs.items[i].name;
    let trackId = songs.items[i].id;
    let features = await track.tracksFeatures(trackId);
    Images.setImage(`top-song-${i + 1}`, trackImage);
    let songColors = await Images.grabImageColors(`top-song-${i + 1}-color-canvas`, trackColorImage);
    document.getElementById(`top-song-${i + 1}`).style.boxShadow = `2px 1px 12px 15px rgba(${songColors[0]}, 1)`;
    var danceability = document.getElementById(`spot-${i + 1}-stats`).getElementsByClassName("progress-bar")[0];
    danceability.style.width = `${(features.danceability * 100)}%`;
    var Energy = document.getElementById(`spot-${i + 1}-stats`).getElementsByClassName("progress-bar")[1];
    Energy.style.width = `${(features.energy * 100)}%`;
    var Instrumentalness = document.getElementById(`spot-${i + 1}-stats`).getElementsByClassName("progress-bar")[2];
    Instrumentalness.style.width = `${(features.instrumentalness * 100)}%`;
    var songName = document.getElementById(`spot-${i + 1}-stats`).getElementsByClassName("song-name")[0];
    songName.innerText = trackName;
    var songArtist = document.getElementById(`spot-${i + 1}-stats`).getElementsByClassName("artist-name")[0];
    songArtist.innerText = trackArtist;
}
//get all of the song canvases
const observedElements = document.querySelectorAll('.song-image');
//this is target for the intersection observer.
const target = document.getElementById("song-card-container");
//what I will set to get the images to get larger and smaller when scrolling left and right.
let prevRatio = 0.0;
let increasingWidth = "calc(65% * ratio)";
/*let decreasingWidth = "calc(65% * ratio)";*/
//this makes an array of numbers that will trigger the intersection observer into performing the calculations to change the width.
function buildThresholdList() {
    let thresholds = [];
    let numSteps = 20;
    for (let i = 1.0; i <= numSteps; i++) {
        let ratio = i / numSteps;
        thresholds.push(ratio);
    }
    thresholds.push(0);
    return thresholds;
}
//creates the intersection oberver with the options that are spcified.
function createObserver() {
    let observer;
    let options = {
        root: target,
        rootMargin: "0% -33.3333333% 0% -33.33333333%",
        threshold: buildThresholdList()
    };
    observer = new IntersectionObserver(handleIntersect, options);
    observedElements.forEach(element => {
        observer.observe(element);
    });
}
//this will check if the amount that the image is intersecting with the target is getting larger and smaller and will make the width of the image smaller or larger deppending on that. 
// it willl also make the image flippable if the image is intersecting with the target.
function handleIntersect(entries, observer) {
    entries.forEach((entry) => {
        const element = entry.target;
        if (entry.intersectionRatio > prevRatio) {
            if (entry.intersectionRatio > .8) {
                element.parentElement.parentElement.style.transform = "rotateY(180deg)";
            }
            element.classList.remove("reduce-card");
            let increase = (entry.intersectionRatio / 2 + 1).toString();
            let width = increasingWidth.replace("ratio", increase);
            element.style.width = width;
        }
        prevRatio = entry.intersectionRatio;
        if (entry.isIntersecting < .1) {
            element.classList.add("reduce-card");
            element.parentElement.parentElement.style.transform = "rotateY(0deg)";
        }
        console.log(prevRatio);
    });
}
createObserver();
//var elements = document.querySelectorAll(".flip-card-btn")
//elements.forEach((entry) => {
//    entry.addEventListener("click", () => {
//        entry.parentElement.parentElement.parentElement.parentElement.classList.add("flippable");
//        entry.parentElement.parentElement.style.transform = "rotateY(180deg)";
//    })
//})
//this code will allow the user to drag left and right in the song card container.
//---------------------------------------------------------------------------------------------------------------
const songCards = document.getElementById("song-card-container");
let sisDown = false;
let sstartX;
let sscrollLeft;
songCards.addEventListener('mousedown', (e) => {
    sisDown = true;
    sstartX = e.pageX - songCards.offsetLeft;
    sscrollLeft = songCards.scrollLeft;
});
songCards.addEventListener('mouseleave', () => {
    sisDown = false;
});
songCards.addEventListener('mouseup', () => {
    sisDown = false;
});
songCards.addEventListener('mousemove', (e) => {
    if (!sisDown)
        return;
    e.preventDefault();
    const x = e.pageX - songCards.offsetLeft;
    const walk = (x - sstartX); //scroll-fast       
    songCards.scrollLeft = sscrollLeft - walk;
});
//-----------------------------------------------------------------------------------------------------------------
//this code will allow the user to drag left and right in the song card container.
for (let i = 0; i < 9; i++) {
    let artistImage = artists.items[i].images[0];
    let artistColorImage = artists.items[i].images[2];
    let artistName = artists.items[i].name;
    let artistPopularity = artists.items[i].popularity;
    let artistFollowers = artists.items[i].followers.total;
    let artistGenres = artists.items[i].genres[0];
    Images.setImage(`top-artist-${i + 1}`, artistImage);
    let songColors = await Images.grabImageColors(`top-artist-${i + 1}-color-canvas`, artistColorImage);
    //let backOfCard = document.getElementById(`artist-spot-${i + 1}-stats`) as HTMLElement
    //backOfCard.parentElement.style.backgroundColor = `rgba(${})`;
    document.getElementById(`top-artist-${i + 1}`).style.boxShadow = `2px 1px 12px 15px rgba(${songColors[0]}, 1)`;
    var songArtist = document.getElementById(`artist-spot-${i + 1}-stats`).getElementsByClassName("artist-name")[0];
    songArtist.innerText = artistName;
    var popularity = document.getElementById(`artist-spot-${i + 1}-stats`).getElementsByClassName("popularity")[0];
    popularity.innerText = artistPopularity;
    var followers = document.getElementById(`artist-spot-${i + 1}-stats`).getElementsByClassName("num-followers")[0];
    followers.innerText = artistFollowers;
    var genres = document.getElementById(`artist-spot-${i + 1}-stats`).getElementsByClassName("genres")[0];
    genres.innerText = artistGenres;
}
//get all of the song canvases
const artistObservedElements = document.querySelectorAll('.artist-image');
//this is target for the intersection observer.
const artistTarget = document.getElementById("artist-card-container");
//what I will set to get the images to get larger and smaller when scrolling left and right.
let artistPrevRatio = 0.0;
let artistIncreasingWidth = "calc(65% * ratio)";
/*let decreasingWidth = "calc(65% * ratio)";*/
//creates the intersection oberver with the options that are spcified.
function createArtistObserver() {
    let observer;
    let options = {
        root: artistTarget,
        rootMargin: "0% -33.3333333% 0% -33.33333333%",
        threshold: buildThresholdList()
    };
    observer = new IntersectionObserver(artistIntersect, options);
    artistObservedElements.forEach(element => {
        observer.observe(element);
    });
}
//this will check if the amount that the image is intersecting with the target is getting larger and smaller and will make the width of the image smaller or larger deppending on that. 
// it willl also make the image flippable if the image is intersecting with the target.
function artistIntersect(entries, observer) {
    entries.forEach((entry) => {
        const element = entry.target;
        if (entry.intersectionRatio > .4) {
        }
        if (entry.intersectionRatio > artistPrevRatio) {
            if (entry.intersectionRatio > .8) {
                element.parentElement.parentElement.style.transform = "rotateY(180deg)";
            }
            element.classList.remove("reduce-card");
            let increase = (entry.intersectionRatio / 2 + 1).toString();
            let width = artistIncreasingWidth.replace("ratio", increase);
            element.style.width = width;
        }
        artistPrevRatio = entry.intersectionRatio;
        if (entry.isIntersecting < .5) {
            element.classList.add("reduce-card");
            element.parentElement.parentElement.style.transform = "rotateY(0deg)";
        }
        console.log(artistPrevRatio);
    });
}
createArtistObserver();
//---------------------------------------------------------------------------------------------------------------
const artistCards = document.getElementById("artist-card-container");
let aisDown = false;
let astartX;
let ascrollLeft;
artistCards.addEventListener('mousedown', (e) => {
    aisDown = true;
    astartX = e.pageX - artistCards.offsetLeft;
    ascrollLeft = artistCards.scrollLeft;
});
artistCards.addEventListener('mouseleave', () => {
    aisDown = false;
});
artistCards.addEventListener('mouseup', () => {
    aisDown = false;
});
artistCards.addEventListener('mousemove', (e) => {
    if (!aisDown)
        return;
    e.preventDefault();
    const x = e.pageX - artistCards.offsetLeft;
    const walk = (x - astartX); //scroll-fast       
    artistCards.scrollLeft = ascrollLeft - walk;
});
//-----------------------------------------------------------------------------------------------------------------
function repeat() {
    setTimeout(async () => {
        if (imageStart < songs.items.length - 1) {
            imageStart++;
            let displayImage = songs.items[imageStart].album.images[0];
            let colorImage = songs.items[imageStart].album.images[2];
            let track = songs.items[imageStart].artists[0].name;
            let artist = songs.items[imageStart].name;
            Images.setImageWithDescription("home-canvas", displayImage, "top-track-name", track, "top-track-artist-name", artist);
            let topColors = await Images.grabImageColors("home-color-canvas", colorImage);
            //If the color is closer to white set text to black do the opposite of the opposite is true. They are multiplied because humans percive color and litness differently 
            let textColor;
            let endOfFirstNum = topColors[0].indexOf(",");
            let r = Number(topColors[0].slice(0, endOfFirstNum)) * .3;
            let endOfSecondNum = topColors[0].indexOf(",", endOfFirstNum + 1);
            let g = Number(topColors[0].slice(endOfFirstNum + 1, endOfSecondNum)) * .59;
            let endOfThirdNum = topColors[0].indexOf(",", endOfSecondNum + 1);
            let b = Number(topColors[0].slice(endOfSecondNum + 1, endOfThirdNum)) * .11;
            let grayScaleColor = r + g + b;
            if (grayScaleColor > 128) {
                textColor = "rgba(0, 0, 0, 1)";
            }
            else {
                textColor = "rgba(255, 255, 255, 1)";
            }
            document.documentElement.style.setProperty("--site-text-color", textColor);
            document.documentElement.style.setProperty("--home-canvas-border-color", textColor);
            /*let siteBackgroundColor = `rgb(${topColors[0]})`;*/
            let siteBackgroundColor = `radial-gradient(18% 28% at 24% 50%, rgba(${topColors[12]}, 1) 7%, #073AFF00 100%),radial-gradient(18% 28% at 18% 71%, rgba(${topColors[10]}, 1) 6%, #073AFF00 100%),
                radial-gradient(70% 53% at 36% 76%, rgba(${topColors[9]}, 1) 0%, #073AFF00 100%),radial-gradient(42% 53% at 15% 94%, rgba(${topColors[8]}, 1) 7%, #073AFF00 100%),
                radial-gradient(42% 53% at 34% 72%, rgba(${topColors[7]}, 1) 7%, #073AFF00 100%),radial-gradient(18% 28% at 35% 87%, rgba(${topColors[6]}, 1) 7%, #073AFF00 100%),
                radial-gradient(31% 43% at 7% 98%, rgba(${topColors[5]}, 1) 24%, #073AFF00 100%),radial-gradient(21% 37% at 72% 23%, rgba(${topColors[4]}, 1) 24%, #073AFF00 100%),
                radial-gradient(35% 56% at 91% 74%, rgba(${topColors[3]}, 1) 9%, #073AFF00 100%),radial-gradient(74% 86% at 67% 38%, rgba(${topColors[2]}, 1) 24%, #073AFF00 100%),
                linear-gradient(125deg,  rgba(${topColors[0]}, 1) 1%,  rgba(${topColors[1]}, 1) 100%)`;
            document.documentElement.style.setProperty("--home-background-color", siteBackgroundColor);
            document.getElementById("greeting-background").style.backgroundImage = `linear-gradient(180deg, rgba(${topColors[0]}, 1) 14%, rgba(${topColors[0]}, 1) 33%, rgba(${topColors[0]}, 0.9) 50%, rgba(${topColors[0]}, ${topColors[0]}, 0.00001) 85%)`;
            repeat();
        }
    }, 4000);
}
//If the color is closer to white set text to black do the opposite of the opposite is true. They are multiplied because humans percive color and litness differently 
function blackOrWhite(topColors) {
    let endOfFirstNum = topColors[0].indexOf(",");
    let r = Number(topColors[0].slice(0, endOfFirstNum)) * .3;
    let endOfSecondNum = topColors[0].indexOf(",", endOfFirstNum + 1);
    let g = Number(topColors[0].slice(endOfFirstNum + 1, endOfSecondNum)) * .59;
    let endOfThirdNum = topColors[0].indexOf(",", endOfSecondNum + 1);
    let b = Number(topColors[0].slice(endOfSecondNum + 1, endOfThirdNum)) * .11;
    let grayScaleColor = r + g + b;
    if (grayScaleColor > 128) {
        return "rgba(0, 0, 0, 1)";
    }
    else {
        return "rgba(255, 255, 255, 1)";
    }
}
//# sourceMappingURL=home.js.map