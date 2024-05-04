
export class CustomError extends Error{
    status!:number;
    constructor(message:string,status:number){
        console.log("Error from custom error defifnition")
        super(message);
        this.status=status;
    }
}