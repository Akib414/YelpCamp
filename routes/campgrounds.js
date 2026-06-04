const express = require('express');
const router = express.Router(); 
const catchAsync = require('../utils/catchAsync');
const Campground = require('../models/campground');

// 🟢 FIXED 1: Destructure ALL the custom middleware functions you are using below
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');

// --- ROUTES ---

// Index Route (maps to /campgrounds)
router.get('/', catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
}));

// New Route (maps to /campgrounds/new)
router.get('/new', isLoggedIn, (req, res) => {
    res.render('campgrounds/new');
});

// Create Route (maps to /campgrounds)
router.post('/', isLoggedIn, validateCampground, catchAsync(async (req, res) => {
    const campground = new Campground(req.body.campground);
    campground.author = req.user._id;
    await campground.save();
    req.flash('success', 'Successfully made a new campground');
    res.redirect(`/campgrounds/${campground._id}`);
}));

// Show Route (maps to /campgrounds/:id)
router.get('/:id', catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate({
        path:'reviews',populate:{path:'author'}
    }).populate('author');
    if (!campground) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { campground });
}));

// Edit Form Route (maps to /campgrounds/:id/edit)
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { campground });
}));

// Update Route (maps to /campgrounds/:id)
router.put('/:id', isLoggedIn, isAuthor, validateCampground, catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndUpdate(id, { ...req.body.campground });    
    req.flash('success', 'Successfully updated campground!');
    res.redirect(`/campgrounds/${id}`);
}));

// Delete Route (maps to /campgrounds/:id)
router.delete('/:id', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Campground Deleted Successfully.');
    res.redirect('/campgrounds');
}));

module.exports = router;