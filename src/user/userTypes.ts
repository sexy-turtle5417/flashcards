import { User } from "@prisma/client";

export type UserRegistrationData = Omit<User, "id">;
