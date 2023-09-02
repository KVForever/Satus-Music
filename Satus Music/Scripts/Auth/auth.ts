class Auth {
    private static clientId = '41a7b7283e534f44b0761ffb963a0759';
    private static urlParams = new URLSearchParams(window.location.search);
    private static code = this.urlParams.get('code');
    public static token: string

    public static async authenticate(): Promise<any> {
        
        if (!this.code) {
            this.redirectToAuthCodeFlow();
        } else {
            var localToken = localStorage.getItem("token");
            if (!localToken) {
                const token = await this.getAccessToken();
                Auth.token = token;
            } else {  
                Auth.token = localToken!;
            }

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

        const result = await fetch("https://accounts.spotify.com/api/token", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: params
        });

        const { access_token } = await result.json();
        localStorage.setItem("token", access_token)
        return access_token;
    }
}

export { Auth }