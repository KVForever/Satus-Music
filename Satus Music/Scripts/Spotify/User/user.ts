class User{
    token: string;
    constructor(token: string) {
        this.token = token;        
    }

    public async currentProfile(): Promise<any> {

        const userInfo = await fetch('https://api.spotify.com/v1/me', {

            method: "GET", headers: { Authorization: `Bearer ${this.token}` }

        });

        const data = userInfo.json();

        return data;
    }

    public async usersTopItems(type: string, timeRange: string = "medium_term", limit: number = 20, offset: number = 0): Promise<any> {
        if (limit < 0 || limit > 50) {
            console.log("You tried making a call for users top items but your limit is not in the range 0-50.");
        }
        else {
            const track = await fetch('https://api.spotify.com/v1/me/top/' + type + '/?offset=' + offset + '&time_range=' + timeRange + '&limit=' + limit, {
                method: "GET", headers: { Authorization: `Bearer ${this.token}` }
            });

            const data = track.json();
            return data;
        }
        
    }
}

export { User }