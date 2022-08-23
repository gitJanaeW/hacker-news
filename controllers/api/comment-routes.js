const router = require('express').Router();
const {Post, User, Comment} = require('../../models');

// get all comments
router.get('/', (req, res) => {
    Comment.findAll({
        attributes: ['id', 'user_id', 'post_id', 'comment', 'created_at', 'updated_at'],
        order: [['created_at', 'ASC']],
        include: [
            {
                model: User,
                attributes: ['username']
            },
            {
                model: Post,
                attributes: ['title']
            }
        ]
    })
        .then(data => res.json(data))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

// post a comment
router.post('/', (req, res) => {
    Comment.create({
        user_id: req.body.user_id,
        post_id: req.body.post_id,
        comment: req.body.comment
    })
        .then(data => res.json(data))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

// delete a comment
router.delete('/:id', (req, res) => {
    Comment.destroy({
        where: {
            id: req.params.id
        }
    })
    .then(data => {
        if (!data) {
            res.status(404).json({message: 'No post found with this id'});
            return;
        }
        res.json(data);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

module.exports = router;