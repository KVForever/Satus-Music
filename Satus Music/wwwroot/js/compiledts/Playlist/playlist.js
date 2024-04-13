import { Auth } from '../Spotify/Auth/auth.js';
import { User } from '../Spotify/User/user.js';
import { Images } from '../Utilites/Images.js';
import { Playlist } from '../Spotify/Playlist/playlist.js';
const token = localStorage.getItem("access_token");
const refresh = localStorage.getItem("refreshTime");
const currentTime = new Date().getTime() / 1000;
var playlists, usersPlaylists;
if (currentTime > Number(refresh)) {
    await Auth.authenticate();
    const user = new User(Auth.token);
    const profile = await user.currentProfile();
    const userId = profile.id;
    playlists = new Playlist(Auth.token, userId);
    usersPlaylists = await playlists.usersPlaylists();
}
else {
    const user = new User(token);
    const profile = await user.currentProfile();
    const userId = profile.id;
    playlists = new Playlist(token, userId);
    usersPlaylists = await playlists.usersPlaylists();
}
console.log(usersPlaylists);
await Promise.all(usersPlaylists.items.map(async (item) => {
    var playlistId = item.id;
    var playlist = await playlists.getPlaylist(playlistId);
    var playlistAnchor = document.createElement("a");
    playlistAnchor.innerHTML = `
        <div class="playlist">
            <img src="${playlist.images[0].url}" width="64px" height="64px" class="rounded"/>
            <div class="ms-3">
                <p class="fs-5">${playlist.name}</p>
                <p>Followers: ${playlist.followers.total}</p>
            </div>
        </div>
    `;
    playlistAnchor.setAttribute("value", playlistId);
    playlistAnchor.setAttribute("draggable", "true");
    playlistAnchor.classList.add("playlist-btn");
    document.getElementById("playlists").appendChild(playlistAnchor);
}));
var playlistDivs = document.querySelectorAll(".playlist-btn");
var prev;
playlistDivs.forEach((playlist) => {
    playlist.addEventListener("click", (item) => {
        if (prev != null) {
            prev.children[0].style.backgroundColor = "#01121c";
        }
        playlist.children[0].style.backgroundColor = "#0d6efd";
        prev = playlist;
    });
    playlist.addEventListener("dragstart", (item) => {
        item.dataTransfer.setData("playlistId", playlist.getAttribute("value"));
    });
});
var search = document.getElementById("library-search");
search.addEventListener("click", (item) => {
    search.style.display = "none";
    var input = search.nextElementSibling;
    input.style.display = "block";
});
var playlistViewOne = document.getElementById("playlist-view-one");
playlistViewOne.addEventListener("dragover", (item) => {
    item.preventDefault();
    playlistViewOne.style.border = "solid white 3px";
});
playlistViewOne.addEventListener("drop", async (item) => {
    playlistViewOne.style.border = "solid black 3px";
    var draggedPlaylist = await playlists.getPlaylist(item.dataTransfer.getData("playlistId"));
    var image = draggedPlaylist.images[0].url;
    document.getElementById("playlist-image").setAttribute("src", image);
    var topColors = await Images.grabImageColors("playlist-color-canvas", draggedPlaylist.images[0]);
    var playlistBackground = `linear-gradient(0deg, #011621 30%, rgba(${topColors[1]}) 70%)`;
    document.getElementById("playlist-background").style.backgroundImage = playlistBackground;
    document.getElementById("playlist-background").style.backgroundSize = '100% 100%';
    document.getElementById("playlist-background").style.backgroundPosition = "0px 0px";
    var playlistName = draggedPlaylist.name;
    document.getElementById("playlist-title").innerText = playlistName;
    var playlistDescription = draggedPlaylist.description;
    document.getElementById("about-playlist").innerText = playlistDescription;
    var playlistOwner = draggedPlaylist.owner.display_name;
    var numTracks = draggedPlaylist.tracks.items.length;
    document.getElementById("playlist-owner").innerText = playlistOwner;
    document.getElementById("num-tracks").innerText = numTracks;
    var durationOfPlaylist = 0;
    for (var i = 0; i < numTracks; i++) {
        durationOfPlaylist += draggedPlaylist.tracks.items[i].track.duration_ms;
    }
    var hrs = Math.floor(durationOfPlaylist / 3600000);
    var min = Math.floor((durationOfPlaylist % 3600000) / 60000);
    var sec = Math.floor((durationOfPlaylist % 60000) / 1000);
    if (hrs > 0) {
        document.getElementById("playlist-duration").innerText = hrs + "hrs " + min + "mins " + sec + "sec";
    }
    else {
        document.getElementById("playlist-duration").innerText = min + "mins " + sec + "sec";
    }
});
playlistViewOne.addEventListener("dragleave", (item) => {
    playlistViewOne.style.border = "solid black 3px";
});
//# sourceMappingURL=playlist.js.map