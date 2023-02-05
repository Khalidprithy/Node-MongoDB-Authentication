const mongoose = require('mongoose');
const { isEmail } = require('validator')

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "Please enter an Email"],
        unique: true,
        lowercase: true,
        validate: [isEmail, 'Please enter a valid Email']
    },
    password: {
        type: String,
        required: [true, "Please enter an Password"],
        minlength: [8, 'Minimum password length is 8 characters'],
    },
});

// Fire a function after document saved to DB
userSchema.post('save', function (doc, next) {
    console.log('New user created and saved', doc)
    next();
});

// Fire a function before document saved to DB
userSchema.pre('save', function (next) {
    console.log('User about to be created and saved', this);
    next();
})

const User = mongoose.model('user', userSchema);

module.exports = User;