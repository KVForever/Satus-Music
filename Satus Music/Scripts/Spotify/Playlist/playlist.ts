class Playlist {
    token: string;
    userId: string;
    constructor(token: string, userId: string) {
        this.token = token;
        this.userId = userId;
    }

    public async usersPlaylists(): Promise<any> {

        const userPlaylistInfo = await fetch('https://api.spotify.com/v1/users/' + this.userId + '/playlists', {

            method: "GET", headers: { Authorization: `Bearer ${this.token}` }

        });

        const data = userPlaylistInfo.json();

        return data;
    }

    public async getPlaylist(playlistId): Promise<any> {
        const playlistInfo = await fetch('https://api.spotify.com/v1/playlists/' + playlistId, {
            method: "GET", headers: { Authorization: `Bearer ${this.token}` }
        });

        const data = playlistInfo.json();

        return data
    }

    //Add cutom playlist image function.

    //Add playlist items function.

    //Remove playlist items function.

    //Update playlist items function.

    //Create playlist function.
}

export { Playlist }