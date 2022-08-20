const router = require('express').Router();
const {User, Post, Vote} = require('../../models');

// get all user data
router.get('/', (req, res) => {
    // findAll extends from Model: it queries all user table rows in the db (equivalent to SELECT * FROM users;)
    User.findAll({
        // protect password by not including it in the return data. Array bc it CAN return multiple values
        attributes: { exclude: ['password'] }
    })
    .then(dbUserData => res.json(dbUserData))
    .catch(err => {
    console.log(err);
    res.status(500).json(err);
    });
});

// get one row of user data
router.get('/:id', (req, res) => {
    // findOne: it queries user table to find one row from the db (equiv to SELECT * FROM users where id = ?;)
    User.findOne({
        attributes: { exclude: ['password'] },
        where: {
        id: req.params.id
        },
        include: [
            {
                model: Post,
                attributes: ['id', 'title', 'post_url', 'created_at']
            },
            {
                model: Comment,
                attributes: ['id', 'comment', 'created_at'],
                include: {
                    model: Post,
                    attributes: ['title']
                }
            },
            {
                model: Post,
                attributes: ['title'],
                through: Vote,
                as: 'voted_posts'
            }
        ]
    })
    .then(dbUserData => {
        if (!dbUserData) {
            res.status(404).json({ message: 'No user found with this id' });
            return;
        }
        res.json(dbUserData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// create a user to add to user data
router.post('/', (req, res) => {
    // create: it creates an row in the users table (equiv to INSERT INTO users (?) VALUES (?);)
    User.create({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    })
    .then(dbUserData => res.json(dbUserData))
        .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

router.post('/login', (req, res) => {
    User.findOne({
        where: {
            email: req.body.email
        }
    })
    .then(dbUserData => {
        if (!dbUserData) {
            res.status(400).json({message: 'Email address is invalid.'});
            return;
        }
        // this will run the User instance method that bcrypt password check anf returns true or false
        const validPassword = dbUserData.checkPassword(req.body.password);
        if (!validPassword){
            res.status(400).json({message: 'Password is invalid.'});
            return;
        }
        res.json({user:dbUserData, message: 'Log in successful.'});
    })
});

// update an existing user in db
router.put('/:id', (req, res) => {
    // update: it updates a row in users table (equiv to UPDATE users SET ?,?,? WHERE id = ?)
    User.update(req.body, {
        individualHooks: true,
        where: {
        id: req.params.id
        }
    })
    .then(dbUserData => {
    if (!dbUserData[0]) {
        res.status(404).json({ message: 'No user found with this id' });
        return;
    }
    res.json(dbUserData);
    })
        .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// remove an existing user from db
router.delete('/:id', (req, res) => {
    // destroy: it removes a row in users table
    User.destroy({
        where: {
        id: req.params.id
        }
    })
    .then(dbUserData => {
        if (!dbUserData) {
            res.status(404).json({ message: 'No user found with this id' });
            return;
        }
        res.json(dbUserData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

module.exports = router;