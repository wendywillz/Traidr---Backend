import axios from 'axios';

export const exchangeCodeForTokens = async (code: string): Promise<{ access_token: string; id_token: string }> => {
    try {
        const response = await axios.post('https://oauth2.googleapis.com/token', {
            code,
            client_id: process.env.GOOGLE_CLIENT_ID,
            client_secret: process.env.GOOGLE_CLIENT_SECRET,
            redirect_uri: 'http://localhost:3000/auth/google/callback',
            grant_type: 'authorization_code',
        });

        console.log('Token Exchange Response:', response.data);

        // Extract access token and ID token from the response
        const { access_token, id_token } = response.data;

        return { access_token, id_token };
    } catch (error) {
        console.error('Error exchanging authorization code for tokens:', error);
        throw error;
    }
};
