const express = require('express');
const router = express.Router();
const passport = require('passport')
const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');
const { storeReturnTo } = require('../middleware');
// 1. Render the registration form view
router.get('/register', (req, res) => {
    res.render('users/register');
});

// 2. Handle registration submission safely
router.post('/register', catchAsync(async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        
      req.login(registeredUser,err => {
        if(err) return next(err);
        req.flash('success', 'Welcome to YelpCamp!');
        res.redirect('/campgrounds');
      })
        
        // 🟢 FIXED: Added the 'success' configuration key argument
       
    } catch (e) {
        // 🟢 FIXED: Catches duplicate database entry errors gracefully 
        // and bounces the user back to try a different username!
        req.flash('error', e.message);
        res.redirect('/register');
    }
}));

router.get('/login' , (req,res) => {
    res.render('users/login');
})
router.post('/login',
    // use the storeReturnTo middleware to save the returnTo value from session to res.locals
    storeReturnTo,
    // passport.authenticate logs the user in and clears req.session
    passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}),
    // Now we can use res.locals.returnTo to redirect the user after login
    (req, res) => {
        req.flash('success', 'Welcome back!');
        const redirectUrl = res.locals.returnTo || '/campgrounds'; // update this line to use res.locals.returnTo now
        res.redirect(redirectUrl);
    });
router.get('/logout', (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/campgrounds');
    });
}); 

module.exports = router;