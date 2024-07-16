import { Auth } from '../Spotify/Auth/auth.js'
import { User } from '../Spotify/User/user.js'
import { Images } from '../Utilites/Images.js'
import { Playlist } from '../Spotify/Playlist/playlist.js'
import { Track } from '../Spotify/Tracks/track.js'
/*import { Chart, ChartConfiguration, ChartData, ChartOptions } from '../lib/chart/dist/chart.js';*/

const token = localStorage.getItem("access_token");
const refresh = localStorage.getItem("refreshTime");
const currentTime = new Date().getTime() / 1000;
var playlists, usersPlaylists, track;

if (currentTime > Number(refresh)) {
    await Auth.authenticate();
    const user = new User(Auth.token)
    const profile = await user.currentProfile();
    const userId = profile.id;
    track = new Track(Auth.token)
    playlists = new Playlist(Auth.token, userId);
    usersPlaylists = await playlists.usersPlaylists();
} else {
    const user = new User(token);
    const profile = await user.currentProfile();
    const userId = profile.id;
    track = new Track(token);
    playlists = new Playlist(token, userId);
    usersPlaylists = await playlists.usersPlaylists();
}

document.body.style.backgroundColor = "black";

await Promise.all(usersPlaylists.items.map(async (item) => {
    var playlistId = item.id;
   /* var playlist = await playlists.getPlaylist(playlistId);*/
    var playlistAnchor = document.createElement("a");
    playlistAnchor.innerHTML = `
        <div class="playlist">
            <img src="${item.images[0].url}" width="64px" height="64px" class="rounded"/>
            <div class="ms-3">
                <p class="fs-5">${item.name}</p>
                <p>Owner: ${item.owner.display_name}</p>
            </div>
        </div>
    `

    playlistAnchor.setAttribute("value", playlistId);
    playlistAnchor.setAttribute("draggable", "true")
    playlistAnchor.classList.add("playlist-btn")
    document.getElementById("playlists").appendChild(playlistAnchor);
}));

var playlistDivs = document.querySelectorAll(".playlist-btn") as any;
var prev;
playlistDivs.forEach((playlist) => {
    playlist.addEventListener("click", (item) => {
        if (prev != null) {
            prev.children[0].style.backgroundColor = "#01121c";
        }
        playlist.children[0].style.backgroundColor = "#0d6efd";
        prev = playlist;
    })
    playlist.addEventListener("dragstart", (item) => {
        if (prev != null) {
            prev.children[0].style.backgroundColor = "#01121c";
        }
        playlist.children[0].style.backgroundColor = "#0d6efd";
        prev = playlist;
        item.dataTransfer.setData("playlistId", playlist.getAttribute("value"));
    })
});

var search = document.getElementById("library-search");
search.addEventListener("click", (item) => {
    search.style.display = "none";
    var input = search.nextElementSibling as HTMLElement;
    input.style.display = "block";
})

var playlistViewOne = document.getElementById("playlist-view-one");
var playlistViewThree = document.getElementById("playlist-view-three");

playlistViewOne.addEventListener("dragover", (item) => {
    item.preventDefault()
    playlistViewOne.style.border = "solid white 3px";
})

var playlistStats = new Array();
var danceability = 0;
var energy = 0;
var instrumentalness = 0;
var valence = 0;
var acousticness = 0;

playlistViewOne.addEventListener("drop", async (item) => {
    document.getElementById("area-one-default-text").style.display = "none";
    document.getElementById("playlist-search").style.display = "block";
    document.getElementById("playlist-background").style.height = "70%";
    playlistViewOne.style.border = "solid black 3px";
    var draggedPlaylist = await playlists.getPlaylist(item.dataTransfer.getData("playlistId"));
    var image = draggedPlaylist.images[0].url;
    document.getElementById("playlist-image").setAttribute("src", image);
    var topColors = await Images.grabImageColors("playlist-color-canvas", draggedPlaylist.images[0]);
    var playlistBackground = `linear-gradient(0deg, #011621 30%, rgba(${topColors[1]}) 70%)`;
    document.getElementById("playlist-background").style.backgroundImage = playlistBackground;
    document.getElementById("playlist-background").style.backgroundSize = '100% 100%';
    document.getElementById("playlist-background").style.backgroundPosition = "0px 0px";
    var descriptionTextColor = blackOrWhite(topColors[1]);
    document.getElementById("playlist-description").style.color = `${descriptionTextColor}`
    var playlistName = draggedPlaylist.name;
    document.getElementById("playlist-title").innerText = playlistName;
    var playlistDescription = draggedPlaylist.description;
    document.getElementById("about-playlist").innerHTML = playlistDescription;
    var playlistOwner = draggedPlaylist.owner.display_name;
    var numTracks = draggedPlaylist.tracks.items.length;
    document.getElementById("playlist-owner").innerHTML = playlistOwner + '<i class="bi bi-dot fs-5 align-middle" > </i>';
    document.getElementById("num-tracks").innerHTML = numTracks + "songs" + '<i class="bi bi-dot fs-5 align-middle"></i>';
    var durationOfPlaylist = 0;
    document.getElementById("table-body").innerHTML = "";

    for (var i = 0; i < numTracks; i++) {
        let trackId = draggedPlaylist.tracks.items[i].track.id;
        let features = await track.tracksFeatures(trackId);
        document.getElementById("playlist-tracks").style.display = "block";
        var songDuration = draggedPlaylist.tracks.items[i].track.duration_ms;
        var tr = document.createElement("tr");
        var dateAdded;
        if (playlistOwner != "Spotify") {
            dateAdded = draggedPlaylist.tracks.items[i].added_at;
            var end = dateAdded.indexOf("T");
            dateAdded = dateAdded.slice(0, end);
        } else {
            dateAdded = "";
        }

        danceability += features.danceability;
        energy += features.energy;
        instrumentalness += features.instrumentalness;
        valence += features.valence;
        acousticness += features.acousticness;

        var trContent = `
            <th scope="row">${i + 1}</th>
            <td><img src="${draggedPlaylist.tracks.items[i].track.album.images[2].url}" class="me-4"></img>${draggedPlaylist.tracks.items[i].track.name}</td>
            <td>${draggedPlaylist.tracks.items[i].track.album.name}</td>
            <td>${dateAdded}</td>
            <td>${Math.floor(songDuration / 60000)}:${Math.floor((songDuration % 60000) / 1000)}</td>`
        tr.innerHTML = trContent
        document.getElementById("table-body").appendChild(tr);
        tr.setAttribute("draggable", "true")
        durationOfPlaylist += songDuration;
    }

    danceability = (danceability / draggedPlaylist.tracks.items.length) * 100;
    energy = (energy / draggedPlaylist.tracks.items.length) * 100;
    instrumentalness = (instrumentalness / draggedPlaylist.tracks.items.length) * 100;
    valence = (valence / draggedPlaylist.tracks.items.length) * 100;
    acousticness = (acousticness / draggedPlaylist.tracks.items.length) * 100;

    var hrs = Math.floor(durationOfPlaylist / 3600000);
    var min = Math.floor((durationOfPlaylist % 3600000) / 60000);
    var sec = Math.floor((durationOfPlaylist % 60000) / 1000);
    if (hrs > 0) {
        document.getElementById("playlist-duration").innerText = hrs + "hrs " + min + "mins"
    } else {
        document.getElementById("playlist-duration").innerText = min + "mins " + sec + "sec";
    }
    document.getElementById("playlist-tracks").style.display = "block";

    var oldcanv = document.getElementById('playlist-statistics');
    oldcanv.remove();

    var canv = document.createElement('canvas');
    canv.id = 'playlist-statistics';
    document.getElementById('playlist-view-two-container').appendChild(canv);
    
    (async function () {
        // @ts-ignore
        new Chart(
            "playlist-statistics",
            {
                type: 'bar',
                data: {
                    labels: [
                        'Danceability',
                        'Energy',
                        'Instrumentalness',
                        'Valence',
                        'Acousticness'
                    ],

                    datasets: [{
                        label: 'Playlist Statistics',
                        data: [danceability, energy, instrumentalness, valence, acousticness],
                        backgroundColor: [
                            'rgb(13, 110, 253)',
                            'rgb(13, 110, 253)',
                            'rgb(13, 110, 253)',
                            'rgb(13, 110, 253)',
                            'rgb(13, 110, 253)'
                        ],
                        borderColor: [
                            'rgb(0,0,0)',
                            'rgb(0,0,0)',
                            'rgb(0,0,0)',
                            'rgb(0,0,0)',
                            'rgb(0,0,0)'
                        ],
                        hoverBackgroundColor: [
                            "#FFFFFF"
                        ],

                        borderWidth: 1


                    }],
                },
                options: {
                    y: {
                        beginAtZero: true,

                    }
                }


            }
        );
    })();
    document.getElementById("playlist-statistics").style.display = "block";
    document.getElementById("area-two-default-text").style.display = "none";
    document.getElementById("playlist-view-two").style.backgroundColor = "#FFFFFF";
});



playlistViewOne.addEventListener("dragleave", (item) => {
    playlistViewOne.style.border = "solid black 3px";
});

playlistViewThree.addEventListener("dragover", (item) => {
    item.preventDefault()
    playlistViewThree.style.border = "solid white 3px";
})

playlistViewThree.addEventListener("drop", async (item) => {
    playlistViewThree.style.borderLeft = "solid black 3px";
    playlistViewThree.style.borderTop = "solid black 3px";
    playlistViewThree.style.borderRight = "0";
    playlistViewThree.style.borderBottom = "0";
    document.getElementById("area-three-default-text").style.display = "none";
});

playlistViewThree.addEventListener("dragleave", (item) => {
    playlistViewThree.style.borderLeft = "solid black 3px";
    playlistViewThree.style.borderTop = "solid black 3px";
    playlistViewThree.style.borderRight = "0";
    playlistViewThree.style.borderBottom = "0";
});



function blackOrWhite(color) {
    let endOfFirstNum = color.indexOf(",")
    let r = Number(color.slice(0, endOfFirstNum)) * .3;
    let endOfSecondNum = color.indexOf(",", endOfFirstNum + 1);
    let g = Number(color.slice(endOfFirstNum + 1, endOfSecondNum)) * .59;
    let endOfThirdNum = color.indexOf(",", endOfSecondNum + 1)
    let b = Number(color.slice(endOfSecondNum + 1, endOfThirdNum)) * .11;
    let grayScaleColor = r + g + b;
    if (grayScaleColor > 128) {
        return "rgba(0, 0, 0, 1)";
    } else {
        return "rgba(255, 255, 255, 1)";
    }
}


export {playlistStats}

