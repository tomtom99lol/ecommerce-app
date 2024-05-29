const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const db = require('./server/db');
const cors = require('cors');


app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(cors());

app.get('/', (request, response) => {
    response.json({ info: 'Node.js, Express, and Postgres API' })
});
  
app.get('/users', db.getUsers);
app.get('/users/:id', db.getUserById);
app.post('/register', db.createUser);
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

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');

app.use(
  session({
    secret: 'bang',
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

app.post(
  '/login',
  passport.authenticate('local', {failureRedirect: '/'}),
  (req, res) => {res.redirect(`/users/${req.user.id}`)}
);

/*app.get('/profile', (req, res) =>{
  res.json()
})*/

app.listen(4001, () =>{
    console.log('Port 4001 is up and running');
});