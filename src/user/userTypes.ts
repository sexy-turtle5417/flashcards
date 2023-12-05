import { User } from "@prisma/client";

export type UserRegistrationData = Omit<User, "id">;
export type UserInfo = Omit<User, "password">;