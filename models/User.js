const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, "Please enter your first name"],
        maxLength: [12, 'Maximum length is 12 characters'],
    },
    lastName: {
        type: String,
        required: [true, "Please enter your last name"],
        maxLength: [12, 'Maximum length is 12 characters'],
    },
    address: {
        type: String,
        required: [true, "Please enter your address"],
        maxLength: [100, 'Maximum length is 100 characters'],
    },
    phone: {
        type: Number,
        required: [true, "Please enter your phone number"],
        maxLength: [16, 'Maximum length is 16 digits'],
    },
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


// Fire a function before document saved to DB
userSchema.pre('save', async function (next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Static method to login user
userSchema.statics.login = async function (email, password) {
    const user = await this.findOne({ email });
    if (user) {
        const auth = await bcrypt.compare(password, user.password);
        if (auth) {
            return user;
        }
        throw Error('Incorrect password');
    }
    throw Error('Incorrect email')
}

const User = mongoose.model('user', userSchema);

module.exports = User;