
const mongoose = require("mongoose");
const cities = require("./cities")
const Campground = require('../models/campground');
const{places,descriptors} = require('./seedhelpers');


mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp');

const db = mongoose.connection;
db.on("error",console.error.bind(console,"connection error"));
db.once("open", () => {
    console.log("Database Connected");
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    for(let i = 0 ; i < 50; i++){
        const random1000 = Math.floor(Math.random()*1000);
        const price = Math.floor(Math.random()*20)+10;
const camp = new Campground({
    location: `${cities[random1000].city}, ${cities[random1000].state}`,
    title: `${sample(descriptors)} ${sample(places)}`,
    // FIXED: Wrapped entirely in backticks so the math random function works
    image: `https://picsum.photos/400?random=${Math.random()}`,
    description: 'Nestled in the lush, rolling hills of Sylhet, the Ratargul Swamp Forest is a breathtaking marvel of nature. As you glide through the dark, mirror-like water on a wooden boat, the vibrant emerald canopy of karach trees creates a tranquil, almost mystical atmosphere. The air smells of wet earth and fresh, crisp leaves, while the profound silence is broken only by the gentle lapping of water and the distant calls of native birds. It is a peaceful, enchanting escape from the bustling streets of Dhaka.',
    price
});
        await camp.save();
    }
};

seedDB().then( () => {
    mongoose.connection.close();
})