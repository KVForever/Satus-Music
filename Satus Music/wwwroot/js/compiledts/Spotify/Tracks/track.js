//This class will return a track.
//@params: requires an API token.
class Track {
    constructor(token) {
        this.token = token;
    }
    async fetchTrack(trackId) {
        const album = await fetch(`https://api.spotify.com/v1/tracks/${trackId}`, {
            method: "GET", headers: { Authorization: `Bearer ${this.token}` }
        });
        const data = album.json();
        return data;
    }
    async tracksFeatures(trackId) {
        const features = await fetch(`https://api.spotify.com/v1/audio-features/${trackId}`, {
            method: "GET", headers: { Authorization: `Bearer ${this.token}` }
        });
        const data = features.json();
        return data;
    }
}
export { Track };
//# sourceMappingURL=track.js.map