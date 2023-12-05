import { PrismaClient, User } from "@prisma/client";
import { UserRegistrationData } from "./userTypes";
import { UserAlreadyExistsError, UserDoesNotExistsError } from "./userErrors";

export interface UserRepository{
    existsById(id: string): Promise<boolean>;
    existsByUsername(username: string): Promise<boolean>;
    save(data: UserRegistrationData): Promise<User>;
    findById(id: string): Promise<User>;
    findByUsername(username: string): Promise<User>;
}

export class UserRepositoryPrismaImpl implements UserRepository{

    private prismaClient: PrismaClient;

    constructor(prismaClient: PrismaClient){
        this.prismaClient = prismaClient;
    }

    async existsById(id: string): Promise<boolean> {
        const existingUser = await this.prismaClient.user.findUnique({ where: { id }});
        if(!existingUser) return false;
        return true
    }

    async existsByUsername(username: string): Promise<boolean> {
        const existingUser = await this.prismaClient.user.findUnique({ where: { username }});
        if(!existingUser) return false;
        return true;
    }

    async save(data: UserRegistrationData): Promise<User> {
        if(await this.existsByUsername(data.username))
            throw new UserAlreadyExistsError(`${data.username} does not exists`);
        const user = await this.prismaClient.user.create({ data });
        return user;
    }

    async findById(id: string): Promise<User> {
        if(!await this.existsById(id))
            throw new UserDoesNotExistsError(`User with id ${id} does not exists`);
        const user = await this.prismaClient.user.findUniqueOrThrow({ where: { id }});
        return user;
    }

    async findByUsername(username: string): Promise<User> {
        if(!await this.existsByUsername(username))
            throw new UserDoesNotExistsError(`${username} does not exists`);
        const user = await this.prismaClient.user.findUniqueOrThrow({ where: { username }});
        return user;
    }
}