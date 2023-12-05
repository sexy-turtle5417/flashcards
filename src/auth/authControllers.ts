import { Context, Hono } from "hono";
import { LogInDetails } from "./authType";
import { invalidJsonRequestBodyFilter } from "../lib/universalMiddlewares";
import { invalidLogInDetailsFilter } from "./authMiddlewares";
import { AuthService } from "./autServices";

export class AuthController{

    private route: Hono;
    private authServie: AuthService;

    constructor(app: Hono, authService: AuthService){
        this.route = app;
        this.authServie = authService;
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