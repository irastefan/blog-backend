import PostModel from '../models/Post.js';

export const getOne = async (req, res) => {
    try {
        const postId = req.params.id;
        
        PostModel.findOneAndUpdate({
            _id: postId,
        }, {
            $inc: { viewsCount: 1 },
        },
        {
            returnDocument: 'after',
        },
        (err, doc) => {
            if (err) {
                console.log(err);
                return res.status(500).json({
                    message: 'Not found',
                });
            }

            if (!doc) {
                return res.status(404).json({
                    message: 'Not found',
                });
            }

            res.json(doc);
        }
      );

    } catch (e) {
        console.log(e);
        res.status(505).json({
            message: 'Not found',
        });
    }
}

export const getAll = async (req, res) => {
    try {
        const posts = await PostModel.find().populate('user').exec();

        res.json(posts);
    } catch (e) {
        console.log(e);
        res.status(505).json({
            message: 'Not found',
        });
    }
}

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

export const update = async (req, res) => {
    try {
        const postId = req.params.id;
        
        await PostModel.updateOne(
            {
            _id: postId,
            },
            {
                title: req.body.title,
                text: req.body.text,
                imageUrl: req.body.imageUrl,
                user: req.userId,
                tags: req.body.tags,
            },
      );

      res.json({
        success: true,
      });

    } catch (err) {
        console.log(err);
        res.status(505).json({
            message: 'Error Update Post',
        });
    }
}

export const remove = async (req, res) => {
    try {
        const postId = req.params.id;
        
        PostModel.findOneAndDelete({
            _id: postId,
        }, (err, doc) => {
            if (err) {
                console.log(err);
                return res.status(500).json({
                    message: 'Error Delete Post',
                });
            }

            if (!doc) {
                return res.status(404).json({
                    message: 'Not found',
                });
            }

            res.json({
                success: true,
            });
        }
      );

    } catch (e) {
        console.log(e);
        res.status(505).json({
            message: 'Not found',
        });
    }
}