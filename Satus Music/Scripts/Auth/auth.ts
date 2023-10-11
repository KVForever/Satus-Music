class Auth {
    private static clientId = '41a7b7283e534f44b0761ffb963a0759';
    private static urlParams = new URLSearchParams(window.location.search);
    private static code = this.urlParams.get('code');
    public static token: string

    public static async authenticate(): Promise<any> {
        
        if (!this.code) {
            this.redirectToAuthCodeFlow();
        } else {
            //localStorage.removeItem("access_token");
            var localToken = `${localStorage.getItem("access_token")}FkdncS`;
            //var localToken = null;
            if (localToken == "undefined" || localToken == null) {
                const token = await this.getAccessToken();
                Auth.token = token;
            } else {  
               // Auth.token = localToken!;
            }
            console.log(localStorage.getItem("refresh_token"));
            console.log(localStorage.getItem("refreshTime"));
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
        params.append("scope", "user-read-private user-read-email user-top-read");
        params.append("code_challenge_method", "S256");
        params.append("code_challenge", challenge);
        document.location = `https://accounts.spotify.com/authorize?${params.toString()}`;
    }

    private static async getAccessToken() {
        const verifier = localStorage.getItem("verifier");

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
                    const refreshParams = new URLSearchParams();
                    refreshParams.append("client_id", this.clientId);
                    refreshParams.append("grant_type", "refresh_token");
                    refreshParams.append("code", this.code);
                    refreshParams.append("refresh_token", localStorage.getItem("refresh_token"));
                    refreshParams.append("redirect_uri", "https://localhost:44374");

                    refreshParams.append("code_verifier", verifier!);
                    const refreshResponse = fetch("https://accounts.spotify.com/api/token", {
                        method: "POST",
                        headers: { "Content-Type": "application/x-www-form-urlencoded" },
                        body: params
                    }).then(refreshResponse => {
                        if (refreshResponse.ok) {
                            console.log("The refresh token was used to get a new access token.")
                        }
                    });
                }
                return response.json();
            })
            .then(data => {               
                localStorage.setItem('access_token', data.access_token);
                localStorage.setItem('refresh_token', data.refresh_token);
                localStorage.setItem('refreshTime', data.expires_in);
            })
            .catch(error => {
                console.error('Error:', error);
            });

        return localStorage.getItem("access_token");
    }
}

export { Auth }