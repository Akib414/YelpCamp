const express = require('express');
// 🟢 FIXED 1: Get the Router directly from express
const router = express.Router(); 
const {isLoggedIn} = require('../middleware');
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Campground = require('../models/campground');

// 🟢 FIXED 2: Destructure your Joi schema so validation works in this file
const { campgroundSchema } = require('../schemas.js'); 

// Middleware for Campground Validation
const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};

// --- ROUTES ---

// Index Route (maps to /campgrounds)
router.get('/', catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
}));

// New Route (maps to /campgrounds/new)
router.get('/new',isLoggedIn, (req, res) => {
 
    res.render('campgrounds/new');
});
// Create Route (maps to /campgrounds)
router.post('/',isLoggedIn, validateCampground, catchAsync(async (req, res) => {
    const campground = new Campground(req.body.campground);
    await campground.save();
    req.flash('success','Successfully made a new campground');
    res.redirect(`/campgrounds/${campground._id}`);
}));

// Show Route (maps to /campgrounds/:id)
router.get('/:id', catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate('reviews');
    if(!campground){
        req.flash('error','Cannot find that campground!');
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/show', { campground });
}));

// Edit Form Route (maps to /campgrounds/:id/edit)
router.get('/:id/edit',isLoggedIn, catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
     if(!campground){
        req.flash('error','Cannot find that campground!');
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit', { campground });
}));

// Update Route (maps to /campgrounds/:id)
router.put('/:id',isLoggedIn, validateCampground, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    req.flash('success','seccessfully updated campground');
    res.redirect(`/campgrounds/${id}`);
}));

// Delete Route (maps to /campgrounds/:id)
router.delete('/:id',isLoggedIn, catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
        req.flash('success','Campground Deleted Successfully.')
    res.redirect('/campgrounds');
}));

// Export the configured router instance
module.exports = router;