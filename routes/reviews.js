const express = require('express');
const router = express.Router({mergeParams: true}); 
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Campground = require('../models/campground');
const Review = require('../models/review');

const { reviewSchema } = require('../schemas.js'); 
const {validateReview,isLoggedIn,isReviewAuthor } = require('../middleware');

// 🟢 FIXED: Changed app.post to router.post
router.post('/',isLoggedIn, validateReview, catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success','New Review Created.')
    res.redirect(`/campgrounds/${campground._id}`);
}));

// 🟢 FIXED: Changed app.delete to router.delete
router.delete('/:reviewId',isLoggedIn,isReviewAuthor, catchAsync(async(req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success','Review Deleted Successfully.')
    res.redirect(`/campgrounds/${id}`);
}));

module.exports = router;