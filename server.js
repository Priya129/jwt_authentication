const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;
const SECRET_KEY = process.env.JWT_SECRET;

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));


// User schema

const UserSchema = new mongoose.Schema({
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
});

const User = mongoose.model('User', UserSchema);

//Register endpoint

app.post('/register', async (req, res) => {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const newUser = new User({email, password: hashedPassword});
        await newUser.save();
        res.status(201).json({message: 'User registered'});
    } catch (err) {
        res.status(400).json({error: 'User already exits'});
    }
});

// Login endpoint
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({email});
        if (!user) return res.status(404).json({error: 'User not found'});

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({error: 'Invalid credential'});

        const token = jwt.sign({id: user._id}, SECRET_KEY, { expiresIn: '1h'});
        res.json({ token });
    } catch (err) {
        res.status(500).json({error: 'Server error'});
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));