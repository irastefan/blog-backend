import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import cors from 'cors';

import { loginValidation, registerValidation, postCreateValidation } from './validations.js';

import { UserController, PostController } from './controllers/index.js';
import { handleValidationError, checkAuth } from './utils/index.js';

mongoose.set('strictQuery', false);
mongoose.connect('mongodb+srv://admin:4rcfbf1A@cluster0.dwszgr4.mongodb.net/blog?retryWrites=true&w=majority')
    .then(() => console.log('DB ok'))
    .catch((err) => console.log('DB error', err));

const app = express();

const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        cb(null, 'uploads');
    },
    filename: (_, file, cb) => {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage });

app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.use(cors());

app.post('/auth/register', registerValidation, handleValidationError, UserController.register);
app.post('/auth/login', loginValidation, handleValidationError, UserController.login);
app.get('/auth/me', checkAuth, UserController.getMe);

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
    res.json({
        url: `/uploads/${req.file.originalname}`,
    });
});

app.get('/posts/:id', PostController.getOne);
app.get('/posts', PostController.getAll);
app.get('/tags/:tag', PostController.getAllByTag);
app.get('/tags', PostController.getLastTags);
app.post('/posts', checkAuth, postCreateValidation, handleValidationError, PostController.create);
app.patch('/posts/:id', checkAuth, postCreateValidation, handleValidationError, PostController.update);
app.delete('/posts/:id', checkAuth, PostController.remove);

app.listen(4444, (err) => {
    if (err) {
        return console.log(err);
    }

    console.log('Server OK');
});