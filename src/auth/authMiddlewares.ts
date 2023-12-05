import { Context } from "hono";
import { LogInDetails } from "./authType";

export async function invalidLogInDetailsFilter(c: Context, next: Function){
    const requestBody: LogInDetails = await c.req.json();
    c.status(400);
    if(!requestBody.username)
        return c.json({ message: 'you need a username to log in'});
    if(!requestBody.password)
        return c.json({ message: 'you need a password to log in'});
    await next();
}