import { Context, Hono } from "hono";
import { LogInDetails } from "./authType";
import { invalidJsonRequestBodyFilter } from "../lib/universalMiddlewares";
import { invalidLogInDetailsFilter } from "./authMiddlewares";
import { AuthService } from "./authServices";
import { IncorrectCredentialsError } from "./authErrors";

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
            try{
                const logInDetails: LogInDetails = await c.req.json();
                const tokens = await this.authServie.authenticate(logInDetails);
                c.status(201);
                return c.json(tokens);
            }
            catch(error){
                c.status(403)
                if(error instanceof IncorrectCredentialsError)
                    return c.json({ message: error.message });
                console.error(error);
                c.status(500);
                return c.json({ message: "server error" });
            }
        });


        return this.route;
    }


}