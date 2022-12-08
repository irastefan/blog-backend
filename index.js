import express from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { validationResult } from 'express-validator';

import { registerValidation } from './validations/auth.js';

import  UserModel from './models/User.js';

mongoose.set('strictQuery', false);
mongoose.connect('mongodb+srv://admin:4rcfbf1A@cluster0.dwszgr4.mongodb.net/blog?retryWrites=true&w=majority')
    .then(() => console.log('DB ok'))
    .catch((err) => console.log('DB error', err));

const app = express();

app.use(express.json());

app.post('/auth/register', registerValidation, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array());
        }
    
        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);
    
        const doc = new UserModel({
            email: req.body.email,
            fullName: req.body.fullName,
            passwordHash,
            avtarUrl: req.body.avtarUrl
        });
    
        const user = await doc.save();
    
        res.json(user)
    } catch (err) {
        res.json({
            message: 'Registration error'
        });
    }
    
});

app.get('/', (req, res) => {
    res.send('Hello, World!');
});

app.post('/auth/login', (req, res) => {
    console.log(req.body);

    const token = jwt.sign({
        email: req.body.email,
        fullName: req.body.fullName,
    },
    'secret123'
    );

    res.json({
        success: true,
        token
    });
});

app.listen(4444, (err) => {
    if (err) {
        return console.log(err);
    }

    console.log('Server OK');
});