// import User from '../api/users/userModel';
// // Authentication and Authorization Middleware
// export default async (req, res, next) => {
//   if (req.session && req.session.authenticated) {
//     let user = await User.findByUserName(req.session.user);
//     if (!user)
//       return res.status(401).json({status:401,message:"unauthorised"});
//     next();
//   } else {
//     return res.status(401).json({status:401,message:"unauthorised"});
//   }
// };

import passport from 'passport';
import passportJWT from 'passport-jwt';
import UserModel from './../api/users/userModel';
import dotenv from 'dotenv';

dotenv.config();

const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

let jwtOptions = {};
jwtOptions.jwtFromRequest = ExtractJWT.fromAuthHeaderAsBearerToken();
jwtOptions.secretOrKey = process.env.SECRET;
const strategy = new JWTStrategy(jwtOptions, async (payload, next) => {
  const user = await UserModel.findByUserName(payload);
  if (user) {
    next(null, user);
  } else {
    next(null, false);
  }
});
passport.use(strategy);

export default passport;