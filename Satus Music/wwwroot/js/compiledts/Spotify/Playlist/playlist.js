class Playlist {
    constructor(token, userId) {
        this.token = token;
        this.userId = userId;
    }
    async usersPlaylists() {
        const userPlaylistInfo = await fetch('https://api.spotify.com/v1/users/' + this.userId + '/playlists', {
            method: "GET", headers: { Authorization: `Bearer ${this.token}` }
        });
        const data = userPlaylistInfo.json();
        return data;
    }
    async getPlaylist(playlistId) {
        const playlistInfo = await fetch('https://api.spotify.com/v1/playlists/' + playlistId, {
            method: "GET", headers: { Authorization: `Bearer ${this.token}` }
        });
        const data = playlistInfo.json();
        return data;
    }
}
export { Playlist };
//# sourceMappingURL=playlist.js.map