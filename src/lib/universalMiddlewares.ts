import { Context } from "hono";

export async function invalidJsonRequestBodyFilter(c: Context, next: Function){
    try{
        await c.req.json();
        await next();
    }catch(err){
        c.status(500);
        return c.json({ message: "requestbody must be valid json"});
    }
}