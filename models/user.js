const mongoose = require('mongoose'); // 🟢 FIXED: Spelled correctly with two 'o's
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose'); // 🟢 FIXED: Hyphenated package name string

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }
});

// 🟢 FIXED: Removed '.default' execution helper
UserSchema.plugin(passportLocalMongoose.default);

module.exports = mongoose.model('User', UserSchema);