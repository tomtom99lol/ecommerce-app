const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const db = require('./server/db');
require("dotenv").config();

const cors = require('cors');

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;



app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(cors({ credentials: true, origin: true }));

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const session = require('express-session');

app.use(
  session({
    secret: 'bang',
    name:'uniqueSessionID',
    cookie : { maxAge : 7 * 24 * 60 * 60 * 1000 },
    resave:false,
    saveUninitialized:false
  })
);

app.use(passport.initialize());  
app.use(passport.session());

// Set method to serialize data to store in cookie
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Set method to deserialize data stored in cookie and attach to req.user
passport.deserializeUser((id, done) => {
  done(null, { id });
});

passport.use(new LocalStrategy(
     function (username, password, done) {
        db.pool.query(
            'SELECT * FROM users WHERE name = $1', [username],
            (error, result) => {
                if (error){
                    return done(error);
                }
                if (!result.rows[0]){  
                    return done(null, false);
                }
                if (result.rows[0].password != password){
                    return done(null, false);
                }
                return done(null, result.rows[0]);
            }
        )
    }
));

passport.use(new GoogleStrategy({
  "clientID": CLIENT_ID,
  "clientSecret": CLIENT_SECRET,
  "callbackURL": "http://localhost:3000/login"
},
function(accessToken, refreshToken, profile, cb) {
  console.log(profile)
  User.findOrCreate({ googleId: profile.id }, function (err, user) {
    return cb(err, user);
  });
}
));

app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile'] }));

app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });

app.get('/', (request, response) => {
    response.json({ info: 'Node.js, Express, and Postgres API' })
    //console.log('jjjjjjj');
});

app.get('/users', db.getUsers);
app.get('/users/:id', db.getUserById );
app.post('/register',  db.createUser);
app.put('/users/:id', db.updateUser);
app.delete('/users/:id', db.deleteUser);

app.get('/products', db.getProducts);
app.get('/products/:id', db.getProductById);
app.post('/products', db.createProduct);

app.get('/carts/:id', db.getCartById);
app.post('/carts/:id', db.addProductToCart);
app.get('/carts/:id/checkout', db.checkoutCart, db.addCartToOrder);

app.get('/orders', db.getAllOrders);
app.get('/orders/:id', db.getOrderById);


app.get('/login');
app.post(
  '/login',
  passport.authenticate('local', {failureRedirect: '/'}),
  (req, res, next) => {
    //req.session.user = { id: 1, username: req.body.username };

    req.session.loggedIn = true;
    //console.log(req.session.loggedIn)
    res.locals.username = req.body.username;
    req.session.username = res.locals.username;
    //console.log(res.locals)
    //console.log(req.body)
    //console.log(req.session);
    //console.log(req.session.username);
    //console.log(req.session.id)
    req.session.save();
    next();
  },
  (req, res) => {res.redirect(`/users/${req.user.id}`)}
);

app.get('/logout',(req,res)=>{
    req.session.destroy();
    res.json({message: 'logged out'})
})

app.get('/loggedInInfo', (req, res) =>{
    console.log(req.session.loggedIn)
    if (req.session.loggedIn === true){
      res.json({message: 'logged in'});
    } else{
      res.json({message: 'not logged in'})
    }
})


app.listen(4001, () =>{
    console.log('Port 4001 is up and running');
});



/*const prod = require('./getAllProducts');

const products = prod.bigFunc()
.then(
  (results) => {
    //console.log(results)
    return results;
  }  
);*/


