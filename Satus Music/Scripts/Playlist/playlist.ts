import { Auth } from '../Spotify/Auth/auth.js'
import { User } from '../Spotify/User/user.js'
import { Images } from '../Utilites/Images.js'
import { Playlist } from '../Spotify/Playlist/playlist.js'

const token = localStorage.getItem("access_token");
const refresh = localStorage.getItem("refreshTime");
const currentTime = new Date().getTime() / 1000;
var playlists, usersPlaylists;

if (currentTime > Number(refresh)) {
    await Auth.authenticate();
    const user = new User(Auth.token)
    const profile = await user.currentProfile();
    const userId = profile.id;
    playlists = new Playlist(Auth.token, userId);
    usersPlaylists = await playlists.usersPlaylists();
} else {
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
    var playlistDiv = document.createElement("div");
    playlistDiv.innerHTML = `
    <img src="${playlist.images[0].url}" width="64px" height="64px" class="mt-3 rounded"/>
    <div class="ms-3">
        <p class="fs-5">${playlist.name}</p>
        <p># Followers: ${playlist.followers.total} </p>
    </div>
    `
    playlistDiv.classList.add("playlist");
    playlistDiv.setAttribute("draggable", "true")
   
    document.getElementById("playlists").appendChild(playlistDiv);
}));

var playlists = document.querySelectorAll("playlist") as any;
playlists.forEach((playlist) => {
    playlist.addEventListener("dragstart", () => {

    })
});

//var playlistId =  usersPlaylists.items[0].id;
//const firstPlaylist = await playlists.getPlaylist(playlistId);
//console.log(firstPlaylist);

