import { Context, Hono } from "hono";
import { UserRegistrationData } from "./userTypes";
import { invalidRegistrationDataFilter } from "./userMiddlewares";
import { invalidJsonRequestBodyFilter } from "../lib/universalMiddlewares";
import { UserService } from "./userService";
import { UserAlreadyExistsError } from "./userErrors";

export class UserController{

    private route: Hono;
    private userService: UserService;
    
    constructor(app: Hono, userService: UserService){
        this.route = app;
        this.userService = userService;
    }

    getRoute(): Hono{
        this.route.use("/register", invalidJsonRequestBodyFilter);
        this.route.use("/register", invalidRegistrationDataFilter);

        this.route.post("/register", async (c: Context) => {
            try{
                const registrationData: UserRegistrationData = await c.req.json();
                const tokens = await this.userService.register(registrationData);
                c.status(201);
                return c.json(tokens);
            }
            catch(error){
                c.status(400);
                if(error instanceof UserAlreadyExistsError)
                    return c.json({ message: error.message });
                console.error(error);
                c.status(500);
                return c.json({ message: "server error"});
            } 
        });
        return this.route;
    }
}