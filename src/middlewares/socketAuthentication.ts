// socket.io.ts
import { Socket } from 'socket.io';
import { CustomError } from '../utils/customError';  // Assuming CustomError is defined elsewhere
import { Payload } from '../models/payload.model';
import passport from 'passport';

// eslint-disable-next-line @typescript-eslint/ban-types
const authenticateSocket = (socket: Socket, next: Function) => {
  passport.authenticate('jwt', (err:Error, payload:Payload, info:any) => {
    if (err) return next(err);
  
    if (!payload) {
      return next(new CustomError('Unauthorized', 401));
    }

    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) {
      return next(new CustomError('Token has expired', 401));
    }
    console.log(payload,"payload Socket Authenticated 😊😊😊😊")
    socket.data.user = payload; // Attach user data to socket
    next();
  })(socket.request, {}, next);
};

export default authenticateSocket;
