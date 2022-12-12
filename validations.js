import { body } from 'express-validator';

export const registerValidation = [
    body('email').isEmail(),
    body('password').isLength({ min: 5 }),
    body('fullName').isLength({ min: 3 }),
    body('avatarUrl').optional().isURL(),
];

export const loginValidation = [
    body('email').isEmail(),
    body('password').isLength({ min: 5 }),
];

export const postCreateValidation = [
    body('title', 'Enter post title').isLength({min: 3}).isString(),
    body('text', 'Enter text').isLength({min: 10}).isString(),
    body('tags', 'Tags is uncorrect').optional().isString(),
    body('imageUrl', 'Link to image is uncorrect').optional().isString(),
];