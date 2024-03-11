import { OAuth2Client, TokenPayload } from 'google-auth-library';

// Initialize a new OAuth2Client instance with your Google credentials
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleSignIn = async (googleToken: string): Promise<{ email: string; username: string }> => {
    try {
        // Verify the token using the OAuth2Client instance
        const ticket = await client.verifyIdToken({
            idToken: googleToken,
            audience: process.env.GOOGLE_CLIENT_ID, 
        });

        // Ensure the ticket has a payload
        if (!ticket || !ticket.getPayload) {
            throw new Error('Invalid token: No payload found');
        }

        // Get the payload of the verified token, which contains user information
        const payload: TokenPayload | undefined = ticket.getPayload();

        if (!payload?.email || !payload?.name) {
            throw new Error('Failed to retrieve user information from Google token');
        }

        // Extract relevant user information (e.g., email, name)
        const email: string = payload.email;
        const username: string = payload.name;

        return { email, username };
    } catch (error) {
        console.error('Error during Google Sign-In:', error);
        throw error;
    }
};
