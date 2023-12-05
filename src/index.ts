import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { UserController } from './user/userControllers';
import { config } from "dotenv";
import { JwtServiceImpl } from './jwtService/jwtService';
import { UserServiceImpl } from './user/userService';
import { UserRepositoryPrismaImpl } from './user/userRepositories';
import { PrismaClient } from '@prisma/client';

config();

const jwtSecretKey = String(process.env.JWT_SECRET_KEY);
const refreshTokenSecretKey = String(process.env.REFRESH_TOKEN_SECRET_KEY);


const app = new Hono()
const jwtService = new JwtServiceImpl(jwtSecretKey, refreshTokenSecretKey);
const userRepository = new UserRepositoryPrismaImpl(new PrismaClient());
const userService = new UserServiceImpl(userRepository, jwtService);
const userController = new UserController(app, userService);

app.route("api/v1/user", userController.getRoute());


serve(app, () => {
    console.log("server started on port 3000");
});
