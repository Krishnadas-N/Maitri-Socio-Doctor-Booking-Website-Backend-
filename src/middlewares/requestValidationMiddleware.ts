import { Request } from "express";
import { Payload } from "../models/payload.model";

type RequestWithUser = Request & { user: Payload };

// Function to assert that the request object has a user property
export function assertHasUser(req: Request): asserts req is RequestWithUser {
    if (!("user" in req)) {
        throw new Error("Request object without user found unexpectedly");
    }
}
