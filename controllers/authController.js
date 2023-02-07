const User = require('../models/User');
var jwt = require('jsonwebtoken');

// handle error function

const handleErrors = (err) => {
    console.log(err.message, err.code);
    let errors = { email: '', password: '' };
    // Incorrect email
    if (err.message === 'Incorrect email') {
        errors.email = 'Email is not registered'
    }
    // Incorrect password
    if (err.message === 'Incorrect password') {
        errors.password = 'Password incorrect'
    }


    // User exists error
    if (err.code === 11000) {
        errors.email = 'Email already registered';
        return errors;
    }
    // Validation error
    if (err.message.includes('user validation failed')) {
        Object.values(err.errors).forEach(({ properties }) => {
            errors[properties.path] = properties.message;
        })
    }
    return errors;
}

// Create token Function
const maxAge = 3 * 24 * 60 * 60;

const createToken = (id) => {
    return jwt.sign({ id }, `${process.env.HEX_TOKEN}`, { expiresIn: maxAge });
}


module.exports.signUpGet = (req, res) => {
    res.render('signup')
}

module.exports.loginGet = (req, res) => {
    res.render('login')
}

module.exports.signUpPost = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.create({ email, password });
        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 })
        res.status(201).json({ user: user._id });
    } catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({ errors })
    }
}

module.exports.loginPost = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.login(email, password);
        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.status(200).json({ user: user._id });

    } catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({ errors });
    }
}

// Logout function

module.exports.logoutGet = (req, res) => {
    res.cookie('jwt', '', { maxAge: 1 });
    res.redirect('/')
}
