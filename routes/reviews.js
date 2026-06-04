const reviews = require('../controllers/reviews');
const express = require('express');
const router = express.Router({mergeParams: true}); 
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Campground = require('../models/campground');
const Review = require('../models/review');

const { reviewSchema } = require('../schemas.js'); 
const {validateReview,isLoggedIn,isReviewAuthor } = require('../middleware');

// 🟢 FIXED: Changed app.post to router.post
router.post('/',isLoggedIn, validateReview, catchAsync(reviews.createReview));

// 🟢 FIXED: Changed app.delete to router.delete
router.delete('/:reviewId',isLoggedIn,isReviewAuthor, catchAsync(reviews.deleteReview));

module.exports = router;