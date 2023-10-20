import { Auth } from './Auth/auth.js'
import { Track } from './Tracks/track.js'
import { User } from './User/user.js'
import { Spotify } from '../js/compiledts/Spotify.js'

//await Auth.authenticate();

//const user = new User(Auth.token);
//const profile = await user.currentProfile();
//const topTracks = await user.usersTopItems("tracks", "long_term");

//document.getElementById("username").innerText = profile.display_name;

//imageStart = 0
//grabImageColors(topTracks, 0, true);

Spotify();
