import { AuthResponse, LogInDetails } from "./authType";
import { compare } from "bcrypt";
import { UserRepository } from "../user/userRepositories";
import { IncorrectCredentialsError } from "./authErrors";
import { JwtService } from "../jwtService/jwtService";

export interface AuthService{
    authenticate(logInDetails: LogInDetails): Promise<AuthResponse>
}

export class AuthServiceImpl implements AuthService{

    private userRepository: UserRepository;
    private jwtService: JwtService;

    constructor(userRepository: UserRepository, jwtService: JwtService){
        this.userRepository = userRepository;
        this.jwtService = jwtService;
    }

    async authenticate(logInDetails: LogInDetails): Promise<AuthResponse> {
        if(!await this.userRepository.existsByUsername(logInDetails.username))
            throw new IncorrectCredentialsError("incorrect username or password");
        const user = await this.userRepository.findByUsername(logInDetails.username);
        const { password, ...payload } = user;
        if(!await compare(logInDetails.password, password))
            throw new IncorrectCredentialsError("incorrect username or password");
        const accessToken = await this.jwtService.signAccessToken(payload);
        const refreshToken = await this.jwtService.signRefreshToken(payload);
        return { accessToken, refreshToken };
    }
}