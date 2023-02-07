const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const cookieParser = require('cookie-parser');
const { requireAuth, checkUser } = require('./middleware/authMiddleware');
require('dotenv').config();

const app = express();

// middleware
app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());

// view engine
app.set('view engine', 'ejs');

// database connection
const mongodbURI = `${process.env.SERVER_URI}`;
mongoose.connect(mongodbURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
  .then((result) => app.listen(8001))
  .catch((err) => console.log(err));

// routes
app.get('*', checkUser);
app.get('/', (req, res) => {
  res.send('Welcome to Node MongoDB Auth')
})

app.use(authRoutes);


// kbindev101
// hxNwmF4iYsfbi5ML