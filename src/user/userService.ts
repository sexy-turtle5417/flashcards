import { AuthResponse } from "../auth/authType";
import { JwtService } from "../jwtService/jwtService";
import { UserRepository } from "./userRepositories";
import { UserInfo, UserRegistrationData } from "./userTypes";

export interface UserService{
    register(registrationData: UserRegistrationData): Promise<AuthResponse>;
    findById(id: string): Promise<UserInfo>;
    findByUsername(username: string): Promise<UserInfo>;
}

export class UserServiceImpl implements UserService{

    private userRepository: UserRepository;
    private jwtService: JwtService;

    constructor(userRepository: UserRepository, jwtService: JwtService){
        this.userRepository = userRepository;
        this.jwtService = jwtService;
    }

    async register(registrationData: UserRegistrationData): Promise<AuthResponse> {
        const user = await this.userRepository.save(registrationData);
        const { password, ...payload } = user;
        const accessToken = await this.jwtService.signAccessToken(payload);
        const refreshToken = await this.jwtService.signRefreshToken(payload);
        return { accessToken, refreshToken };
    }

    async findById(id: string): Promise<UserInfo> {
        const user = await this.userRepository.findById(id);
        const { password, ...userInfo } = user;
        return userInfo;
    }

    async findByUsername(username: string): Promise<UserInfo> {
        const user = await this.userRepository.findByUsername(username);
        const{ password, ...userInfo} = user;
        return userInfo;
    } 
}