class Track {
    constructor(token) {
        this.token = token;
    }
    async fetchAlbumArt(token, track) {
        let prefix = 'https://api.spotify.com/v1/albums/';
        let location = prefix.concat(track.items[0].album.id);
        const album = await fetch(location, {
            method: "GET", headers: { Authorization: `Bearer ${token}` }
        });
        const data = album.json();
        return await data;
    }
}
//# sourceMappingURL=track.js.map