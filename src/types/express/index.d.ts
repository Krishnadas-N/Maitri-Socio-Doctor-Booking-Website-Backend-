import { tokenData } from "../../../utils/passportUtils";
import { Payload } from "../../models/payload.model";


export {}

declare global {
    namespace Express {
      export interface Request {
        language?: Language;
        user?: Payload;
     
      }
    }
  }