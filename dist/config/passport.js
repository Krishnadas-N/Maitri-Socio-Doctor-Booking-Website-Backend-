"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_jwt_1 = require("passport-jwt");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const publicKeyPath = path_1.default.join(__dirname, '../../id_rsa_pub.pem'); // Update with your public key path
const publicKey = fs_1.default.readFileSync(publicKeyPath, 'utf8');
const options = {
    jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: publicKey,
    // algorithms: ['RS256'] 
};
function configurePassport(passport) {
    console.log(publicKey);
    passport.use(new passport_jwt_1.Strategy(options, (jwtPayload, done) => __awaiter(this, void 0, void 0, function* () {
        try {
            console.log(jwtPayload);
            return done(null, jwtPayload);
        }
        catch (error) {
            return done(error, false);
        }
    })));
}
exports.default = configurePassport;
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
