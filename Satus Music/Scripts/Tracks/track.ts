class Track {
    token: Promise<any>;
    public constructor(token: Promise<any>) {
        this.token = token;
    }

    public async fetchTrack(trackId: any): Promise<any> {

        const album = await fetch('https://api.spotify.com/v1/tracks/' + trackId, {
            method: "GET", headers: { Authorization: `Bearer ${this.token}` }
        });

        const data = album.json();
        return data
    }

}

export { Track }