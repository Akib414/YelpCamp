const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review');
const CampgroundSchema = new Schema({
    title: String,
    image: String,
    price: Number,
    description: String,
    location: String,
    reviews:[
        {
           type:Schema.Types.ObjectId,
           ref:'Review'
        }
    ]

});

// 🟢 THE FIXED CODE
CampgroundSchema.post('findOneAndDelete', async function(doc) {
    if (doc) {
        // Adding 'await' forces Node to pause until the reviews are completely wiped out
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        });
    }
});

module.exports = mongoose.model('Campground',CampgroundSchema);