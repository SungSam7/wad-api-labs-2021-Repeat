import dotenv from 'dotenv';
import express from 'express';
import moviesRouter from './api/movies';
import bodyParser from 'body-parser';
import './db';
import {loadUsers, loadMovies} from './seedData';
import usersRouter from './api/users';
import session from 'express-session';
import passport from './authenticate';



dotenv.config();

const app = express();

const errHandler = (err, req, res, next) => {
  /* if the error in development then send stack trace to display whole error,
  if it's in production then just send error message  */
  if(process.env.NODE_ENV === 'production') {
    return res.status(500).send(`Something went wrong!`);
  }
  res.status(500).send(`Hey!! You caught the error 👍👍, ${err.stack} `);


  
 
};

if (process.env.SEED_DB) {
  loadUsers();
  loadMovies();
}




const port = process.env.PORT;


app.use(session({
  secret: 'ilikecake',
  resave: true,
  saveUninitialized: true
}));


app.use(passport.initialize());

app.use('/api/movies', passport.authenticate('jwt', {session: false}), moviesRouter);



app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(express.static('public'));
app.use('/api/movies', moviesRouter)
app.use('/api/users', usersRouter);
app.use(errHandler);



app.listen(port, () => {
  console.info(`Server running at ${port}`);
});


// app.use('/api/movies', authenticate, moviesRouter);