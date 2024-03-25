import * as jwt from 'jsonwebtoken';
import * as fs from 'fs';


const PRIV_KEY: string = fs.readFileSync('id_rsa_priv.pem', 'utf8');

interface User {
    _id: string;
    role:string;
}

export function issueJWT(user:User):{token: string; expiresIn: string}{
    const _id:string = user._id;
    const expiresIn: string = '1d';
    const payload = {
        sub : _id,
        role:user.role,
        iat : Date.now()
    }
    const signedToken:string = jwt.sign(payload,PRIV_KEY,{expiresIn : expiresIn,algorithm: 'RS256'});

    return {
        token : signedToken,
        expiresIn : expiresIn
    }
}