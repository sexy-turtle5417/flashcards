import { Payload } from "@prisma/client/runtime/library";
import { JwtPayload, sign, verify } from "jsonwebtoken";

export interface JwtService{
    signAccessToken(payload: string | Object): Promise<string>;
    signRefreshToken(payload: string | Object): Promise<string>;
    verifyRefreshToken(token: string): Promise<JwtPayload | string>;
}

export class JwtServiceImpl implements JwtService{

    private jwtSecret: string;
    private refreshTokenSecret: string;

    constructor(jwtSecret: string, refreshTokenSecret: string){
        this.jwtSecret = jwtSecret;
        this.refreshTokenSecret = refreshTokenSecret;
    }

    async verifyRefreshToken(token: string): Promise<JwtPayload | string> {
        const initialPayload: any = verify(token, this.refreshTokenSecret);
        const { iat, exp, ...payload } = initialPayload;
        return payload;
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