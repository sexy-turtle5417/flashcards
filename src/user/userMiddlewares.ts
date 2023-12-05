import { Context } from "hono";
import { UserRegistrationData } from "./userTypes";

export async function invalidRegistrationDataFilter(c: Context, next: Function){
    const requestBody: UserRegistrationData = await c.req.json();
    c.status(400);
    if(!requestBody.username)
        return c.json({ message: "username is a required field"});
    if(!requestBody.password)
        return c.json({ message: "password is a required field"});
    await next();
}