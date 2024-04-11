import { Strategy, ExtractJwt, VerifiedCallback } from 'passport-jwt';
import fs from 'fs';
import path from 'path';
import { tokenData } from '../utils/passportUtils';
const publicKeyPath = path.join(__dirname, '../id_rsa_pub.pem'); // Update with your public key path
const publicKey = fs.readFileSync(publicKeyPath, 'utf8');

const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: publicKey, 
    // algorithms: ['RS256'] 
  };


  export default function configurePassport(passport:any) {
    console.log(publicKey);
    passport.use(
        new Strategy(options, async (jwtPayload:tokenData, done: VerifiedCallback) => {
          try {
            console.log(jwtPayload);
            return done(null, jwtPayload);
          } catch (error) {
            return done(error, false);
          }
        })
    )
    }

  



// import passport from "passport";
// import passportGoogle from "passport-google-oauth20";
// import dotenv from 'dotenv';
// const GoogleStrategy = passportGoogle.Strategy;
// dotenv.config();

// passport.serializeUser((user, done) => {
//     done(null, user);
//   });
  
//   passport.deserializeUser((user, done) => {
//     done(null, user);
//   });

//   passport.use(
//     new GoogleStrategy(
//       {
//         clientID: process.env.CLIENT_ID as string,
//         clientSecret: process.env.CLIENT_SECRET as string,
//         callbackURL: "http://localhost:3000/auth/google/callback"
//       },
//       (accessToken, refreshToken, profile, done) => {
//         const userData = {
//         //   email: profile?.emails[0]?.value || "mail.com",
//           name: profile.displayName,
//           token: accessToken
//         };
//         done(null, userData);
//       }
//     )
//   );

// passport.deserializeUser(function(id, done) {
//     User.findById(id, function(err, user) {
//       done(err, user);
//     });
//   });
//   passport.use(new GoogleStrategy({
//       clientID: process.env.CLIENT_ID,
//       clientSecret: process.env.CLIENT_SECRET,
//       callbackURL: "http://localhost:4000/auth/google/callback",
//       userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
//     },
//     function(accessToken, refreshToken, profile, cb) {
//       User.findOrCreate({ googleId: profile.id, username: profile.id }, function (err, user) {
//         return cb(err, user);
//       });
//     }
//   ));


