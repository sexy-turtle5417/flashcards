export class UserAlreadyExistsError extends Error{
    constructor(message: string){
        super(message);
    }
}

export class UserDoesNotExistsError extends Error{
    constructor(message: string){
        super(message);
    }
}