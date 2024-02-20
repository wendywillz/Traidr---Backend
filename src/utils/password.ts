import { hash, compare } from 'bcrypt';

const saltRounds = 10;

//hash the password
export const hashPassword = async (password: string): Promise<string> => {
    const hashedPassword = await hash(password, saltRounds);
    return hashedPassword;
};

//compare the password with the hashed password
export const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
    const isMatch = await compare(password, hashedPassword);
    return isMatch;
}