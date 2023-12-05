import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { UserController } from './user/userControllers';
import { config } from "dotenv";
import { JwtServiceImpl } from './jwtService/jwtService';
import { UserServiceImpl } from './user/userService';
import { UserRepositoryPrismaImpl } from './user/userRepositories';
import { PrismaClient } from '@prisma/client';
import { AuthController } from './auth/authControllers';
import { AuthServiceImpl } from './auth/authServices';

config();

const jwtSecretKey = String(process.env.JWT_SECRET_KEY);
const refreshTokenSecretKey = String(process.env.REFRESH_TOKEN_SECRET_KEY);


const app = new Hono()
const jwtService = new JwtServiceImpl(jwtSecretKey, refreshTokenSecretKey);
const userRepository = new UserRepositoryPrismaImpl(new PrismaClient());
const userService = new UserServiceImpl(userRepository, jwtService);
const userController = new UserController(app, userService);

const authService = new AuthServiceImpl(userRepository, jwtService);
const authController = new AuthController(app, authService);

app.route("api/v1/user", userController.getRoute());
app.route("api/v1/auth/", authController.getRoute());

serve(app, () => {
    console.log("server started on port 3000");
});
