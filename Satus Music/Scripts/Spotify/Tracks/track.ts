//This class will return a track.
//@params: requires an API token.
//@output: returns a track object.
class Track {
    private token: string;
    public constructor(token: string) {
        this.token = token;
    }

    public async fetchTrack(trackId: any): Promise<any> {

        const album = await fetch(`https://api.spotify.com/v1/tracks/${trackId}`, {
            method: "GET", headers: { Authorization: `Bearer ${this.token}` }
        });

        const data = album.json();
        return data;
    }

    public async tracksFeatures(trackId: any): Promise<any> {
        const features = await fetch(`https://api.spotify.com/v1/audio-features/${trackId}`, {
            method: "GET", headers: { Authorization: `Bearer ${this.token}` }
        });

        const data = features.json();
        return data;
    }

}

export { Track }