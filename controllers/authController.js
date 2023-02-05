const User = require('../models/User')

// handle error function

const handleErrors = (err) => {
    console.log(err.message, err.code);
    let errors = { email: '', password: '' };
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
        res.status(201).json(user);
    } catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({ errors })
    }
}

module.exports.loginPost = async (req, res) => {
    const { email, password } = req.body;
    console.log(email, password);
    res.send('user login')
}
