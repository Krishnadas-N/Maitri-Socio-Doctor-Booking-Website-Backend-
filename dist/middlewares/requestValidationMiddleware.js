"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assertHasUser = void 0;
// Function to assert that the request object has a user property
function assertHasUser(req) {
    if (!("user" in req)) {
        throw new Error("Request object without user found unexpectedly");
    }
}
exports.assertHasUser = assertHasUser;
