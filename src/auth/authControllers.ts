import { Context, Hono } from "hono";
import { LogInDetails } from "./authType";
import { invalidJsonRequestBodyFilter } from "../lib/universalMiddlewares";
import { invalidLogInDetailsFilter } from "./authMiddlewares";
import { AuthService } from "./authServices";
import { IncorrectCredentialsError } from "./authErrors";
import { JsonWebTokenError } from "jsonwebtoken";

export class AuthController{

    private route: Hono;
    private authService: AuthService;

    constructor(app: Hono, authService: AuthService){
        this.route = app;
        this.authService = authService;
    }

    getRoute(): Hono{

        this.route.use("/login", invalidJsonRequestBodyFilter);
        this.route.use("/login", invalidLogInDetailsFilter);

        this.route.post("/login", async (c: Context) => {
            try{
                const logInDetails: LogInDetails = await c.req.json();
                const tokens = await this.authService.authenticate(logInDetails);
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

        this.route.post("/refresh", async (c: Context) => {
            try{
                const authHeader = c.req.header("Authorization");
                if(!authHeader){
                    c.status(400);
                    return c.json({ message: "Must have an Authoriztion header"});
                }
                const prefix = String(authHeader.split(" ")[0]);
                if(prefix != "Bearer"){
                    c.status(400);
                    return c.json({ message: "token must be prefixed with 'Bearer'"})
                }
                const token = String(authHeader.split(" ")[1]);
                const tokens = await this.authService.refreshToken(token);
                return c.json(tokens);
            }
            catch(error){
                c.status(403);
                if(error instanceof JsonWebTokenError){
                    return c.json({ message: error.message });
                }
                console.error(error);
                c.status(500);
                return c.json({ message: "server error"});
            }
        });

        return this.route;
    }


}