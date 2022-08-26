const router = require('express').Router();
const sequelize = require('../config/connection');
const {Post, User, Comment} = require('../models');
const withAuth = require('../utils/auth');

// withAuth: when withAuth() calls next(), itwill call the next function (in this case the callback)
router.get('/', withAuth, (req, res) => {
    Post.findAll({
        where: {
            user_id: req.session.user_id
        },
        attributes: [
            'id',
            'post_url',
            'title',
            'created_at',
            [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']
        ],
        include: [
            {
                model: Comment,
                attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
                include: {
                    model: User,
                    attributes: ['username']
                }
            },
            {
                model: User,
                attributes: ['username']
            }
        ]
    })
    .then(dbPostData => {
        // serializedata so it doesn't appear as [Object] when read
        const posts = dbPostData.map(post => post.get({plain: true}));
        console.log(dbPostData);
        // render the dashboard if a user is loggedIn 
        // (including the post information from the above Post.findAll so it can be used in dashboard.handlebars)
        res.render('dashboard', {posts, loggedIn: true});
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

router.get('/edit/:id', withAuth, (req, res) => {
    Post.findOne({
        where: {
            id: req.params.id
        },
        attributes: [
            'id',
            'post_url',
            'title',
            'created_at',
            [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)', 'vote_count')]
        ],
        include: [
            {
                model: Comment,
                attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
                include: {
                    model: User,
                    attributes: ['username']
                }
            },
            {
                model: User,
                attributes: ['username']
            }
        ]
    })
    .then(dbPostData => {
        if (!dbPostData) {
            res.status(404).json({message: 'No post found with this id'});
            return;
        }
        // reformat the data sent back so it's not in [Object] format
        const post = dbPostData.get({plain: true});
        // render the edit-post file in handlebars
        res.rednder('edit-post.handlebars', {post, loggedIn: req.session.loggedIn});
    })
    .catch(err => {
        if (err) {
            console.log(err);
            res.status(500).json(err);
        }
    })
});

module.exports = router;