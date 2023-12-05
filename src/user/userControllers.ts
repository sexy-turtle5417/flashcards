import { Context, Hono } from "hono";
import { UserRegistrationData } from "./userTypes";
import { invalidRegistrationDataFilter } from "./userMiddlewares";
import { invalidJsonRequestBodyFilter } from "../lib/universalMiddlewares";

export class UserController{

    private route: Hono;
    
    constructor(app: Hono){
        this.route = app;
    }

    getRoute(): Hono{
        this.route.use("/register", invalidJsonRequestBodyFilter);
        this.route.use("/register", invalidRegistrationDataFilter);

        this.route.post("/register", async (c: Context) => {
            const registrationData: UserRegistrationData = await c.req.json();
            c.status(201);
            return c.json(registrationData);
        });
        return this.route;
    }
}