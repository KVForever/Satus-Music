import { Auth } from '../Spotify/Auth/auth.js'
import { User } from '../Spotify/User/user.js'
import { Images } from '../Utilites/Images.js'

async function home() {
    await Auth.authenticate();
    const user = new User(Auth.token);
    const profile = await user.currentProfile();
    document.getElementById("username").innerText = profile.display_name;
    const tracks = await user.usersTopTracks("tracks", "medium_term");
    const artists = await user.usersTopArtists("artists", "short-term")
    let imageStart = Math.floor(Math.random() * 19);
    /*let imageStart = 0;*/


//track
    let trackOne = tracks.items[0].album.images[0];
    let trackOneColorImage = tracks.items[0].album.images[2];
    let trackOneName = tracks.items[0].artists[0].name;
    let trackOneArtist = tracks.items[0].name;

    let trackTwo = tracks.items[1].album.images[0];
    let trackTwoColorImage = tracks.items[1].album.images[2];
    let trackTwoName = tracks.items[1].artists[0].name;
    let trackTwoArtist = tracks.items[1].name;

    let trackThree = tracks.items[2].album.images[0];
    let trackThreeColorImage = tracks.items[2].album.images[2];
    let trackThreeName = tracks.items[2].artists[0].name;
    let trackThreeArtist = tracks.items[2].name;

    Images.setImage("top-song-one", trackOne, "top-song-one-name", trackOneName, "top-song-one-artist-name", trackOneArtist);
    let songOneColors = await Images.grabImageColors("top-song-one-color-canvas", trackOneColorImage);
    document.getElementById("top-song-one").style.boxShadow = `2px 1px 20px 5px rgba(${songOneColors.read(0).r}, ${songOneColors.read(0).g}, ${songOneColors.read(0).b}, 1)`;
    Images.setImage("top-song-two", trackTwo, "top-song-two-name", trackTwoName, "top-song-two-artist-name", trackTwoArtist);
    let songTwoColors = await Images.grabImageColors("top-song-two-color-canvas", trackTwoColorImage);
    document.getElementById("top-song-one").style.boxShadow = `2px 1px 20px 5px rgba(${songTwoColors.read(0).r}, ${songTwoColors.read(0).g}, ${songTwoColors.read(0).b}, 1)`;
    Images.setImage("top-song-three", trackThree, "top-song-three-name", trackThreeName, "top-song-three-artist-name", trackThreeArtist);
    let songThreeColors = await Images.grabImageColors("top-song-three-color-canvas", trackThreeColorImage);
    document.getElementById("top-song-one").style.boxShadow = `2px 1px 20px 5px rgba(${songThreeColors.read(0).r}, ${songThreeColors.read(0).g}, ${songThreeColors.read(0).b}, 1)`;

    //artist
    let artistOneImage = artists.items[0].images[0];
    let artistOneName = artists.items[0].name;

    let artistTwoImage = artists.items[1].images[0];
    let artistTwoName = artists.items[1].name;

    let artistThreeImage = artists.items[2].images[0];
    let artistThreeName = artists.items[2].name;

    Images.setArtistImage("top-artist-one", artistOneImage, "top-artist-one-name", artistOneName);
    Images.setArtistImage("top-artist-two", artistTwoImage, "top-artist-two-name", artistTwoName);
    Images.setArtistImage("top-artist-three", artistThreeImage, "top-artist-three-name", artistThreeName);


    let displayImage = tracks.items[imageStart].album.images[0];
    let colorImage = tracks.items[imageStart].album.images[2];
    let track = tracks.items[imageStart].artists[0].name;
    let artist = tracks.items[imageStart].name;

    Images.setImage("home-canvas", displayImage, "top-track-name", track, "top-track-artist-name", artist);
    let topColors = await Images.grabImageColors("home-color-canvas", colorImage);
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
    document.getElementById("greeting-background").style.background = `linear-gradient(180deg, rgba(${(topColors.read(0).r - 30)}, ${topColors.read(0).g - 30}, 
        ${topColors.read(0).b - 30}, 1) 14%, rgba(${topColors.read(0).r - 20}, ${topColors.read(0).g - 20}, ${topColors.read(0).b - 20}, 1) 33%, rgba(${topColors.read(0).r - 10}, 
        ${topColors.read(0).g - 10}, ${topColors.read(0).b - 10}, 0.9) 50%, rgba(${topColors.read(0).r}, ${topColors.read(0).g}, ${topColors.read(0).b}, 0.6) 66%, 
        rgba(${topColors.read(0).r + 10}, ${topColors.read(0).g + 10}, ${topColors.read(0).b + 10}, 0.00001) 85%)`;

   

    /*repeat();*/

    function repeat() {
        setTimeout(async () => {
            if (imageStart < tracks.items.length - 1) {
                imageStart++;

                let displayImage = tracks.items[imageStart].album.images[0];
                let colorImage = tracks.items[imageStart].album.images[2];
                let track = tracks.items[imageStart].artists[0].name;
                let artist = tracks.items[imageStart].name;

                Images.setImage("home-canvas", displayImage, "top-track-name", track, "top-track-artist-name", artist);
                let topColors = await Images.grabImageColors("home-color-canvas", colorImage);
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

export { home }