const clientId = '41a7b7283e534f44b0761ffb963a0759';
const urlParams = new URLSearchParams(window.location.search);
let code = urlParams.get('code');
if (!code) {
    redirectToAuthCodeFlow(clientId);
}
else {
    const accessToken = await getAccessToken(clientId, code);
    const profile = await fetchProfile(accessToken);
    const track = await fetchTopTrack(accessToken);
    const art = await fetchAlbumArt(accessToken, track);
    populateUI(profile, art, track);
}
function generateRandomString(length) {
    let text = '';
    let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}
async function generateCodeChallenge(codeVerifier) {
    function base64encode(string) {
        return btoa(String.fromCharCode.apply(null, new Uint8Array(string)))
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/, '');
    }
    const encoder = new TextEncoder();
    const data = encoder.encode(codeVerifier);
    const digest = await window.crypto.subtle.digest('SHA-256', data);
    return base64encode(digest);
}
async function redirectToAuthCodeFlow(clientId) {
    const verifier = generateRandomString(128);
    const challenge = await generateCodeChallenge(verifier);
    localStorage.setItem("verifier", verifier);
    const params = new URLSearchParams();
    params.append("client_id", clientId);
    params.append("response_type", "code");
    params.append("redirect_uri", "https://localhost:7195");
    params.append("scope", "user-read-private user-read-email user-top-read");
    params.append("code_challenge_method", "S256");
    params.append("code_challenge", challenge);
    document.location = `https://accounts.spotify.com/authorize?${params.toString()}`;
}
async function getAccessToken(clientId, code) {
    const verifier = localStorage.getItem("verifier");
    const params = new URLSearchParams();
    params.append("client_id", clientId);
    params.append("grant_type", "authorization_code");
    params.append("code", code);
    params.append("redirect_uri", "https://localhost:7195");
    params.append("code_verifier", verifier);
    const result = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params
    });
    const { access_token } = await result.json();
    return access_token;
}
async function fetchProfile(token) {
    const userInfo = await fetch('https://api.spotify.com/v1/me', {
        method: "GET", headers: { Authorization: `Bearer ${token}` }
    });
    const data = userInfo.json();
    return await data;
}
async function fetchTopTrack(token) {
    const track = await fetch(' https://api.spotify.com/v1/me/top/tracks?time_range=short_term&limit=5', {
        method: "GET", headers: { Authorization: `Bearer ${token}` }
    });
    const data = track.json();
    return await data;
}
async function fetchAlbumArt(token, track) {
    let prefix = 'https://api.spotify.com/v1/albums/';
    let location = prefix.concat(track.items[0].album.id);
    const album = await fetch(location, {
        method: "GET", headers: { Authorization: `Bearer ${token}` }
    });
    const data = album.json();
    return await data;
}
function populateUI(profile, art, track) {
    document.getElementById("displayName").innerText = profile.display_name;
    document.getElementById("home-img").style.backgroundImage = "url(" + art.images[0].url + ")";
    document.getElementById("top-track").textContent = track.items[0].name;
}
export {};
//# sourceMappingURL=spotify.js.map