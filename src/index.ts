import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { UserController } from './user/userControllers';


const app = new Hono()
const userController = new UserController(app);

app.route("api/v1/user", userController.getRoute());


serve(app, () => {
    console.log("server started on port 3000");
});
