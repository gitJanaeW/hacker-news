const router = require('express').Router();
const sequelize = require('../config/connection');
const {Post, User, Comment} = require('../models');

router.get('/', (req, res) => {
    // render the dashboard if a user is loggedIn
    res.render('dashboard', {loggedIn: true});
});

module.exports = router;