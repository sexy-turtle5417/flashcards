import { SignOptions, sign } from "jsonwebtoken";

export interface JwtService{
    signAccessToken(payload: string | Object): Promise<string>;
    signRefreshToken(payload: string | Object): Promise<string>;
}

export class JwtServiceImpl implements JwtService{

    private jwtSecret: string;
    private refreshTokenSecret: string;

    constructor(jwtSecret: string, refreshTokenSecret: string){
        this.jwtSecret = jwtSecret;
        this.refreshTokenSecret = refreshTokenSecret;
    }

    async signAccessToken(payload: string | Object): Promise<string> {
        const accessToken = sign(payload, this.jwtSecret, { expiresIn: '10min'});
        return accessToken;
    }

    async signRefreshToken(payload: string | Object): Promise<string> {
        const refreshToken = sign(payload, this.refreshTokenSecret, { expiresIn: "8hrs"});
        return refreshToken;
    }
}