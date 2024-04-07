//This class will return an authentication token that can be use for API requests for Spotify.
class Auth {
    private static clientId = '41a7b7283e534f44b0761ffb963a0759';
    private static urlParams = new URLSearchParams(window.location.search);
    private static code = this.urlParams.get('code');
    public static token: string;

    public static async authenticate(): Promise<any> {

        var localToken = localStorage.getItem("access_token");
        var refreshToken = localStorage.getItem("refresh_token");
        const currentTime = new Date().getTime() / 1000;
        const refresh = localStorage.getItem("refreshTime");
        if (!this.code) {
            this.redirectToAuthCodeFlow();
        } else if (localToken && refresh && refreshToken) {

            if (currentTime < Number(refresh)) {
                Auth.token = localToken;
            } else {
                const newToken = await Auth.refreshAccessToken(refreshToken);
                Auth.token = newToken;
            }

        } else {
            const initalToken = await Auth.getAccessToken();
            Auth.token = initalToken;
        }
    }


    private static generateRandomString(length: number): string {
        let text = '';
        let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

        for (let i = 0; i < length; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    }

    private static async generateCodeChallenge(codeVerifier: string) {
        function base64encode(string) {
            return btoa(String.fromCharCode.apply(null, new Uint8Array(string)))
                .replace(/\+/g, '-')
                .replace(/\//g, '_')
                .replace(/=+$/, '');
        }

        const encoder = new TextEncoder();
        const data = encoder.encode(codeVerifier);
        const digest = await window.crypto.subtle.digest('SHA-256', data);

        return base64encode(digest);
    }


    private static async redirectToAuthCodeFlow() {
        const verifier = this.generateRandomString(128);
        const challenge = await this.generateCodeChallenge(verifier);

        localStorage.setItem("verifier", verifier);

        const params = new URLSearchParams();
        params.append("client_id", this.clientId);
        params.append("response_type", "code");
        params.append("redirect_uri", "https://localhost:44374");
        params.append("scope", "user-read-private user-read-email user-top-read playlist-read-private playlist-read-collaborative");
        params.append("code_challenge_method", "S256");
        params.append("code_challenge", challenge);
        document.location = `https://accounts.spotify.com/authorize?${params.toString()}`;
    }

    private static async getAccessToken(): Promise<string> {
        const verifier = localStorage.getItem("verifier");
        const currentTime = new Date().getTime() / 1000;

        const params = new URLSearchParams();
        params.append("client_id", this.clientId);
        params.append("grant_type", "authorization_code");
        params.append("code", this.code);
        params.append("redirect_uri", "https://localhost:44374");
        params.append("code_verifier", verifier!);

        const response = await fetch("https://accounts.spotify.com/api/token", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: params
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('HTTP status ' + response.status);
                }
                return response.json();
            })
            .then(data => {
                localStorage.setItem('access_token', data.access_token);
                localStorage.setItem('refresh_token', data.refresh_token);
                const refreshTime = currentTime + data.expires_in;
                localStorage.setItem('refreshTime', refreshTime);
            })
            .catch(error => {
                console.error('Error:', error);
                throw error;
            });

        return localStorage.getItem("access_token");
    }

    private static async refreshAccessToken(refreshToken: string): Promise<string> {
        if (!refreshToken) {
            throw new Error('No resfresh token available');
        }
        const currentTime = new Date().getTime() / 1000;
        const params = new URLSearchParams();
        params.append("client_id", this.clientId);
        params.append("grant_type", "refresh_token");
        params.append("refresh_token", localStorage.getItem("refresh_token"));

        const response = await fetch("https://accounts.spotify.com/api/token", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: params
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('HTTP status ' + response.status);
                }
                return response.json();
            })
            .then(data => {
                localStorage.setItem('access_token', data.access_token);
                localStorage.setItem('refresh_token', data.refresh_token);
                const refreshTime = currentTime + data.expires_in;
                localStorage.setItem('refreshTime', refreshTime);
            })
            .catch(error => {
                console.error('Error:', error);
                throw error;
            });

        return localStorage.getItem("access_token");
    }
}

export { Auth }