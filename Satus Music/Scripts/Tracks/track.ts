class Track {
    token: Promise<any>;
    getTrack: Promise<any>
    constructor(token: Promise<any>) {
        this.token = token;
    }

    async fetchTrack(trackId: any): Promise<any> {

        const album = await fetch('https://api.spotify.com/v1/tracks/' + trackId, {
            method: "GET", headers: { Authorization: `Bearer ${this.token}` }
        });

        const data = album.json();
        this.getTrack = data
    }

}

export { Track }