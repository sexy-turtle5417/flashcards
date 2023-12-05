export class IncorrectCredentialsError extends Error{
    constructor(message: string){
        super(message);
    }
}