class Track {
    constructor(token) {
        this.token = token;
    }
    async fetchTrack(trackId) {
        const album = await fetch('https://api.spotify.com/v1/tracks/' + trackId, {
            method: "GET", headers: { Authorization: `Bearer ${this.token}` }
        });
        const data = album.json();
        this.getTrack = data;
    }
}
export { Track };
//# sourceMappingURL=track.js.map