import express from 'express';
import mongoose from 'mongoose';

import { loginValidation, registerValidation, postCreateValidation } from './validations.js';

import checkAuth from './utils/checkAuth.js';
import * as UserController from './controllers/UserController.js';
import * as PostController from './controllers/PostController.js';

mongoose.set('strictQuery', false);
mongoose.connect('mongodb+srv://admin:4rcfbf1A@cluster0.dwszgr4.mongodb.net/blog?retryWrites=true&w=majority')
    .then(() => console.log('DB ok'))
    .catch((err) => console.log('DB error', err));

const app = express();

app.use(express.json());

app.post('/auth/register', registerValidation, UserController.register);

app.post('/auth/login', loginValidation, UserController.login);

app.get('/auth/me', checkAuth, UserController.getMe);

app.get('/', (req, res) => {
    res.send('Blog');
});

app.get('/posts/:id', PostController.getOne);
app.get('/posts', PostController.getAll);
app.post('/posts', checkAuth, postCreateValidation, PostController.create);
app.patch('/posts/:id', checkAuth, PostController.update);
app.delete('/posts/:id', checkAuth, PostController.remove);

app.listen(4444, (err) => {
    if (err) {
        return console.log(err);
    }

    console.log('Server OK');
});