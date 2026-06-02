const express = require('express');
const path = require('path');
const mongoose = require("mongoose");
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');

// Import routers
const campgrounds = require('./routes/campgrounds');
const reviews = require('./routes/reviews');

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
    console.log("Database Connected");
});

const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname,'public')));
const sessionConfig = {
    secret:'BetterSecrects',
    resave: false,
    saveUninitialized: true,
    cookie:{
        httpOnly:true,
        expires: Date.now() + 1000*60*60*24*7,
        maxAge:1000*60*60*24*7
    }
}
app.use(session(sessionConfig));
app.use(flash());

app.use((req,res,next) => {
   res.locals.success = req.flash('success');
   res.locals.error = req.flash('error');
   next();
})
// --- ROUTES ---

app.get('/', (req, res) => {
    res.render("home");
});

// Link routers to their respective path prefixes
app.use('/campgrounds', campgrounds);
app.use('/campgrounds/:id/reviews', reviews);

// 🟢 FIXED: Safe, standard wildcard catch-all for unmatched URLs
app.all('/{*path}', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404));
});

// Central Error Handler
app.use((err, req, res, next) => {
    if (err.name === 'CastError') {
        err = new ExpressError('Page Not Found', 404);
    }
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Something Went Wrong!';
    res.status(statusCode).render('error', { err });
});

app.listen(3000, () => {
    console.log("serving on port 3000");
});