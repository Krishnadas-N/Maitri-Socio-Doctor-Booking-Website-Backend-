import * as jwt from 'jsonwebtoken';
import * as fs from 'fs';
import { Payload } from '../src/models/payload.model';
import { objectId } from '../src/models/users.model';
import { RoleDetails } from '../src/domain/entities/Admin';


const PRIV_KEY: string = fs.readFileSync('id_rsa_priv.pem', 'utf8');

export interface tokenData {
    _id: objectId | undefined | string; 
    roles:RoleDetails[] |  string[];
}



export function issueJWT(user:tokenData):{token: string; expiresIn: number}{
    console.log(PRIV_KEY);
    const _id:objectId |string= user._id ||  '';
    const issuedAt: number = Math.floor(Date.now() / 1000);
    const expiration: number = issuedAt + 24 * 60 * 60;
    const payload:Payload = {
        id : _id,
        roles:user.roles ||  [{roleId:'6612457293c66989fc111447', name: 'User', permissions: ['Read'] }], // Default to User if no role is provided
        iat : Date.now(),
        exp:expiration
    }
    const signedToken: string = jwt.sign(payload, PRIV_KEY, { algorithm: 'RS256' });
    return {
      token: signedToken,
      expiresIn: expiration
    };
}