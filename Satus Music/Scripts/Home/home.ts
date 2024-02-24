import { Auth } from '../Spotify/Auth/auth.js'
import { User } from '../Spotify/User/user.js'
import { Images } from '../Utilites/Images.js'
import { Track } from '../Spotify/Tracks/track.js'

async function home() {
    await Auth.authenticate();
    const user = new User(Auth.token);
    const track = new Track(Auth.token);
    const profile = await user.currentProfile();
    document.getElementById("username").innerText = profile.display_name;
    const songs = await user.usersTopItems("tracks", "medium_term");
    const artists = await user.usersTopItems("artists", "medium_term");
    /* let imageStart = Math.floor(Math.random() * 19);*/
    let imageStart = 0;

    let displayImage = songs.items[imageStart].album.images[0];
    let colorImage = songs.items[imageStart].album.images[2];
    let song = songs.items[imageStart].artists[0].name;
    let artist = songs.items[imageStart].name;

    Images.setImageWithDescription("home-canvas", displayImage, "top-track-name", song, "top-track-artist-name", artist);
    let topColors = await Images.grabImageColors("home-color-canvas", colorImage);
    /* let test = await Images.grabImageColorsTwo("home-color-canvas", colorImage);*/
    
    var textColor = blackOrWhite(topColors)

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
    document.getElementById("greeting-background").style.background = `linear-gradient(180deg, rgba(${topColors[0]}, 1) 14%, rgba(${topColors[0]}, 1) 33%, rgba(${topColors[0]}, 0.9) 50%, rgba(${topColors[0]}, ${topColors[0]}, 0.00001) 85%)`;

    let artistOneImage = artists.items[0].images[0];
    let artistOneColorImage = artists.items[0].images[2];
    let artistOneName = artists.items[0].name;

    let artistTwoImage = artists.items[1].images[0];
    let artistTwoColorImage = artists.items[1].images[2];
    let artistTwoName = artists.items[1].name;

    let artistThreeImage = artists.items[2].images[0];
    let artistThreeColorImage = artists.items[2].images[2];
    let artistThreeName = artists.items[2].name;

    Images.setArtistImage("top-artist-one", artistOneImage, "top-artist-one-name", artistOneName);
    let artistOneColors = await Images.grabImageColors("top-artist-one-color-canvas", artistOneColorImage);
    document.getElementById("top-artist-one").style.boxShadow = `2px 1px 12px 15px rgba(${artistOneColors[0]}, 1)`;


    Images.setArtistImage("top-artist-two", artistTwoImage, "top-artist-two-name", artistTwoName);
    let artistTwoColors = await Images.grabImageColors("top-artist-two-color-canvas", artistTwoColorImage);
    document.getElementById("top-artist-two").style.boxShadow = `2px 1px 12px 15px rgba(${artistTwoColors[0]}, 1)`;

    Images.setArtistImage("top-artist-three", artistThreeImage, "top-artist-three-name", artistThreeName);
    let artistThreeColors = await Images.grabImageColors("top-artist-three-color-canvas", artistThreeColorImage);
    document.getElementById("top-artist-three").style.boxShadow = `2px 1px 12px 15px rgba(${artistThreeColors[0]}, 1)`;


    repeat();

    

    //track
    //var tableBackgroundColors: string[] = [];

    //for (let i = 0; i < 10; i++){
    //    document.getElementById(`artist${i + 1}`).innerHTML = `${songs.items[i].album.artists[0].name}`;
    //    document.getElementById(`song${i + 1}`).innerHTML = `${songs.items[i].name}`;
    //    document.getElementById(`popularity${i + 1}`).innerHTML = `${songs.items[i].popularity}`;
    //    let trackImage = songs.items[i].album.images[2];
    //    Images.setImage(`cover${i + 1}`, trackImage);
    //    let topColors = await Images.grabImageColors(`cover${i + 1}`, trackImage);
    //    document.getElementById(`background${i + 1}`).style.color = "black";
    //    let gradiant = `linear-gradient(-90deg, rgba(${topColors[0]}, .8) 0%, rgba(${topColors[2]}, .8) 100%)`;
    //    tableBackgroundColors.push(gradiant);
    //};


    //var tableRows = document.querySelectorAll('#song-table tr');
    //var i = 1
    //tableRows.forEach(function (row) {
    //    tableRows[i].addEventListener('mouseover', function () {
    //        var id = row.id
    //        let whichOne = Number(id.slice(10))
    //        var color = tableBackgroundColors[whichOne];
    //        this.style.backgroundImage = color;
    //        let textColor = blackOrWhite(color);
    //        this.style.color = textColor;
    //    });

    //    tableRows[i].addEventListener('mouseout', function () {
    //        this.style.backgroundImage = 'none'; // Reset background color on mouseout
    //        this.style.backgroundColor = "white";
    //        this.style.color = "black";
    //    });
    //    i++
    //});


    for (let i = 0; i < songs.items.length / 2; i++) { 
        let trackImage = songs.items[i].album.images[0];
        let trackColorImage = songs.items[i].album.images[2];
        let trackName = songs.items[i].artists[0].name;
        let trackArtist = songs.items[i].name;
        let trackId = songs.items[i].id;
        let features = await track.tracksFeatures(trackId);

        Images.setImageWithDescription(`top-song-${i+1}`, trackImage, `top-song-${i+1}-name`, trackName, `top-song-${i+1}-artist-name`, trackArtist);
        let songColors = await Images.grabImageColors(`top-song-${i+1}-color-canvas`, trackColorImage);
        document.getElementById(`top-song-${i+1}`).style.boxShadow = `2px 1px 12px 15px rgba(${songColors[0]}, 1)`;
        document.getElementById(`spot-${i+1}-stats`).innerHTML = `Danceability: ${features.danceability} <br> Energy: ${features.energy} <br> Instrumentalness: ${features.instrumentalness}`
        
    }

    const observedElements = document.querySelectorAll('.song-image');
    const target = document.getElementById("card-container")
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            const element = entry.target as HTMLElement
            if (entry.isIntersecting) {
                element.style.width = "100%";
            } else {
                element.style.width = "65%";
            }
        });
    }, {
        root: target,
        rootMargin: "0% -33.33% 0% -33.33%",
        threshold: .50
    });

    observedElements.forEach(element => {
        observer.observe(element)
    })
    

    const cards = document.getElementById("card-container");
    let isDown = false;
    let startX;
    let scrollLeft;
    

    cards.addEventListener('mousedown', (e) => {
        isDown = true;
        startX = e.pageX - cards.offsetLeft;
        scrollLeft = cards.scrollLeft;
    });

    cards.addEventListener('mouseleave', () => {
        isDown = false;
    });

    cards.addEventListener('mouseup', () => {
        isDown = false;
    });

    cards.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - cards.offsetLeft;      
        const walk = (x - startX); //scroll-fast       
        cards.scrollLeft = scrollLeft - walk;
    });
    
   

    //let trackOne = songs.items[0].album.images[0];
    //let trackOneColorImage = songs.items[0].album.images[2];
    //let trackOneName = songs.items[0].artists[0].name;
    //let trackOneArtist = songs.items[0].name;
    //let trackId = songs.items[0].id;
    //let features = await track.tracksFeatures(trackId);

    //let trackTwo = songs.items[1].album.images[0];
    //let trackTwoColorImage = songs.items[1].album.images[2];
    //let trackTwoName = songs.items[1].artists[0].name;
    //let trackTwoArtist = songs.items[1].name;

    //let trackThree = songs.items[2].album.images[0];
    //let trackThreeColorImage = songs.items[2].album.images[2];
    //let trackThreeName = songs.items[2].artists[0].name;
    //let trackThreeArtist = songs.items[2].name;

    //Images.setImageWithDescription("top-song-one", trackOne, "top-song-one-name", trackOneName, "top-song-one-artist-name", trackOneArtist);
    //let songOneColors = await Images.grabImageColors("top-song-one-color-canvas", trackOneColorImage);
    //document.getElementById("top-song-one").style.boxShadow = `2px 1px 12px 15px rgba(${songOneColors[0]}, 1)`;
  

    //Images.setImageWithDescription("top-song-two", trackTwo, "top-song-two-name", trackTwoName, "top-song-two-artist-name", trackTwoArtist);
    //let songTwoColors = await Images.grabImageColors("top-song-two-color-canvas", trackTwoColorImage);
    //document.getElementById("top-song-two").style.boxShadow = `2px 1px 12px 15px rgba(${songTwoColors[0]}, 1)`;
    //document.getElementById("spot-1-stats").innerHTML = `Danceability: ${features.danceability} <br> Energy: ${features.energy} <br> Instrumentalness: ${features.instrumentalness}`

    //Images.setImageWithDescription("top-song-three", trackThree, "top-song-three-name", trackThreeName, "top-song-three-artist-name", trackThreeArtist);
    //let songThreeColors = await Images.grabImageColors("top-song-three-color-canvas", trackThreeColorImage);
    //document.getElementById("top-song-three").style.boxShadow = `2px 1px 12px 15px rgba(${songThreeColors[0]}, 1)`;
    


  
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
                let endOfFirstNum = topColors[0].indexOf(",")
                let r = Number(topColors[0].slice(0, endOfFirstNum)) * .3;
                let endOfSecondNum = topColors[0].indexOf(",", endOfFirstNum + 1);
                let g = Number(topColors[0].slice(endOfFirstNum + 1, endOfSecondNum)) * .59;
                let endOfThirdNum = topColors[0].indexOf(",", endOfSecondNum + 1)
                let b = Number(topColors[0].slice(endOfSecondNum + 1, endOfThirdNum)) * .11;
                let grayScaleColor = r + g + b;
                if (grayScaleColor > 128) {
                    textColor = "rgba(0, 0, 0, 1)";
                } else {
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
        let endOfFirstNum = topColors[0].indexOf(",")
        let r = Number(topColors[0].slice(0, endOfFirstNum)) * .3;
        let endOfSecondNum = topColors[0].indexOf(",", endOfFirstNum + 1);
        let g = Number(topColors[0].slice(endOfFirstNum + 1, endOfSecondNum)) * .59;
        let endOfThirdNum = topColors[0].indexOf(",", endOfSecondNum + 1)
        let b = Number(topColors[0].slice(endOfSecondNum + 1, endOfThirdNum)) * .11;
        let grayScaleColor = r + g + b;
        if (grayScaleColor > 128) {
            return "rgba(0, 0, 0, 1)";
        } else {
            return "rgba(255, 255, 255, 1)";
        }
    }

    

}



export { home }