import { Context, Hono } from "hono";
import { LogInDetails } from "./authType";
import { invalidJsonRequestBodyFilter } from "../lib/universalMiddlewares";
import { invalidLogInDetailsFilter } from "./authMiddlewares";

export class AuthController{

    private route: Hono;

    constructor(app: Hono){
        this.route = app;
    }

    getRoute(): Hono{

        this.route.use("/login", invalidJsonRequestBodyFilter);
        this.route.use("/login", invalidLogInDetailsFilter);

        this.route.post("/login", async (c: Context) => {
            const logInDetails: LogInDetails = await c.req.json();
            c.status(201);
            return c.json(logInDetails);
        });


        return this.route;
    }


}