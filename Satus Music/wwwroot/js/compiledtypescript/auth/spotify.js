import { Auth } from '../Auth/auth.js';
import { User } from '../User/user.js';
async function spotify() {
    await Auth.authenticate();
    const user = new User(Auth.token);
    const profile = await user.currentProfile();
    const topTracks = await user.usersTopItems("tracks");
    document.getElementById("display-name").innerText = profile.display_name;
    document.getElementById("top-track-name").textContent = topTracks.items[5].name;
    const canvas = document.getElementById("home-canvas");
    const context = canvas.getContext("2d");
    var img = new Image();
    img.crossOrigin = "anonymous";
    img.src = topTracks.items[5].album.images[0].url;
    canvas.width = topTracks.items[5].album.images[0].width;
    canvas.height = topTracks.items[5].album.images[0].height;
    let mostCommonColor;
    let commonRed;
    let commonGreen;
    let commonBlue;
    img.onload = function () {
        context.drawImage(img, 0, 0);
        const imgData = context.getImageData(canvas.width / 2, canvas.height / 2, canvas.width / 4, canvas.height / 4);
        //context.putImageData(imgData, 100, 100)
        let count = 0;
        const redArray = new Array();
        const greenArray = new Array();
        const blueArray = new Array();
        let colors = [redArray, blueArray, greenArray];
        for (var a = 0; a < colors.length; a++) {
            for (var i = count; i < imgData.data.length / 3; i += 4) {
                colors[a].push(imgData.data[i]);
            }
            count++;
        }
        count = 0;
        let m = 0;
        let mf = 1;
        var item;
        for (var c = 0; c < colors.length; c++) {
            for (var d = count; d < colors[c].length; d++) {
                for (var e = d; e < colors[c].length; e++) {
                    if (colors[c][d] == colors[c][e]) {
                        m++;
                        if (mf < m) {
                            mf = m;
                            item = colors[c][d];
                            if (count == 0) {
                                commonRed = colors[c][d];
                            }
                            else if (count == 1) {
                                commonGreen = colors[c][d];
                            }
                            else {
                                commonBlue = colors[c][d];
                            }
                        }
                    }
                }
                m = 0;
            }
            mf = 0;
            count++;
            console.log(item);
            mostCommonColor = "rgba(" + commonRed + "," + commonGreen + "," + commonBlue + ")";
            const test = 0;
        }
        //document.getElementById("welcome").style.color = mostCommonColor;
        //document.getElementById("top-track").style.color = mostCommonColor;
        //document.getElementById("home-canvas").style.boxShadow = " 0px 0px 30px 10px " + mostCommonColor;
        document.body.style.backgroundColor = mostCommonColor;
    };
}
spotify();
//export { }
//const clientId = '41a7b7283e534f44b0761ffb963a0759';
//const urlParams = new URLSearchParams(window.location.search);
//let code = urlParams.get('code');
//if (!code) {
//    redirectToAuthCodeFlow(clientId);
//} else {
//    const accessToken = await getAccessToken(clientId, code);
//    const profile = await fetchProfile(accessToken);
//    const track = await fetchTopTrack(accessToken);
//    const art = await fetchAlbumArt(accessToken, track);
//    populateUI(profile, art, track);
//}
//function generateRandomString(length: number) {
//    let text = '';
//    let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
//    for (let i = 0; i < length; i++) {
//        text += possible.charAt(Math.floor(Math.random() * possible.length));
//    }
//    return text;
//}
//async function generateCodeChallenge(codeVerifier: string) {
//    function base64encode(string) {
//        return btoa(String.fromCharCode.apply(null, new Uint8Array(string)))
//            .replace(/\+/g, '-')
//            .replace(/\//g, '_')
//            .replace(/=+$/, '');
//    }
//    const encoder = new TextEncoder();
//    const data = encoder.encode(codeVerifier);
//    const digest = await window.crypto.subtle.digest('SHA-256', data);
//    return base64encode(digest);
//}
//async function redirectToAuthCodeFlow(clientId: string) {
//    const verifier = generateRandomString(128);
//    const challenge = await generateCodeChallenge(verifier);
//    localStorage.setItem("verifier", verifier);
//    const params = new URLSearchParams();
//    params.append("client_id", clientId);
//    params.append("response_type", "code");
//    params.append("redirect_uri", "https://localhost:7195");
//    params.append("scope", "user-read-private user-read-email user-top-read");
//    params.append("code_challenge_method", "S256");
//    params.append("code_challenge", challenge);
//    document.location = `https://accounts.spotify.com/authorize?${params.toString()}`;
//}
//async function getAccessToken(clientId: string, code: string) {
//    const verifier = localStorage.getItem("verifier");
//    const params = new URLSearchParams();
//    params.append("client_id", clientId);
//    params.append("grant_type", "authorization_code");
//    params.append("code", code);
//    params.append("redirect_uri", "https://localhost:7195");
//    params.append("code_verifier", verifier!);
//    const result = await fetch("https://accounts.spotify.com/api/token", {
//        method: "POST",
//        headers: { "Content-Type": "application/x-www-form-urlencoded" },
//        body: params
//    });
//    const { access_token } = await result.json();
//    return access_token;
//}
//async function fetchProfile(token: string): Promise<any> {
//    const userInfo = await fetch('https://api.spotify.com/v1/me', {
//        method: "GET", headers: { Authorization: `Bearer ${token}` }
//    });
//    const data = userInfo.json();
//    return await data;
//}
//async function fetchTopTrack(token: string): Promise<any> {
//    const track = await fetch(' https://api.spotify.com/v1/me/top/tracks?time_range=short_term&limit=5', {
//        method: "GET", headers: {Authorization: `Bearer ${token}` }
//    });
//    const data = track.json();
//    return await data;
//}
//async function fetchAlbumArt(token: string, track: any): Promise<any> {
//    let prefix = 'https://api.spotify.com/v1/albums/';
//    let location = prefix.concat(track.items[0].album.id)
//    const album = await fetch(location, {
//        method: "GET", headers: {Authorization: `Bearer ${token}`}
//    });
//    const data = album.json();
//    return await data
//}
//function populateUI(profile: any, art: any, track: any) {
//    document.getElementById("displayName")!.innerText = profile.display_name;
//    document.getElementById("home-img")!.style.backgroundImage = "url(" + art.images[0].url + ")";
//    document.getElementById("top-track").textContent = track.items[0].name;
//}
//# sourceMappingURL=spotify.js.map