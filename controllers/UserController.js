import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';

import UserModel from '../models/User.js';

export const register = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array());
        }
    
        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
    
        const doc = new UserModel({
            email: req.body.email,
            fullName: req.body.fullName,
            avtarUrl: req.body.avtarUrl,
            passwordHash: hash,
        });
    
        const user = await doc.save();

        const {passwordHash, ...userData} = user._doc;

        const token = jwt.sign(
            {
            _id: user._id,
            }, 
            'secret123',
            {
                expiresIn: '30d',
            }
        );
    
        res.json({
            ...userData,
            token,
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Registration error'
        });
    }
    
}

export const login = async (req, res) => {
    try {
        const user = await UserModel.findOne({email: req.body.email});

        if (!user) {
            return  res.status(404).json({
                message: 'Unknown email address or password',
            });
        }

        const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash);
        if (!isValidPass) {
            return res.status(404).json({
                message: 'Unknown email address or password',
            });
        }

        const {passwordHash, ...userData} = user._doc;

        const token = jwt.sign(
            {
            _id: user._id,
            }, 
            'secret123',
            {
                expiresIn: '30d',
            }
        );
    
        res.json({
            ...userData,
            token,
        });
    
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Login error', 
        });
    }
}

export const getMe = async (req, res) => {
    try {
        const user = await UserModel.findOne({_id: req.userId});

        if (!user) {
            return res.status(404).json({
                message: 'User not found',
            })
        }

        const {passwordHash, ...userData} = user._doc;
    
        res.json(userData);
    } catch (err) {
        console.log(err);
    }
}