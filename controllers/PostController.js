import PostModel from '../models/Post.js';

export const create = async (req, res) => {
    try {
        const doc = new PostModel({
            title: req.body.title,
            text: req.body.text,
            imageUrl: req.body.imageUrl,
            tags: req.body.tags.split(','),
            user: req.userId,
        });

        const post = await doc.save();

        res.json(post);
    } catch (e) {
        console.log(e);
        res.status(500).json({
            message: 'Create post Error',
        });
    }
}

export const getAll = async (req, res) => {
    try {
        const posts = await PostModel.find();

        res.json(posts);
    } catch (e) {
        console.log(e);
        res.status(505).json({
            message: 'Not found',
        });
    }
}