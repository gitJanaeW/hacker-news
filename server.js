const path = require('path');
const express = require('express');
const session = require ('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const exphbs = require('express-handlebars');
const hbs = exphbs.create({});
const routes = require('./controllers');
const sequelize = require('./config/connection');

const app = express();
const PORT = process.env.PORT || 3001;

// express middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));

// express handlebars
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

// turn on routes
app.use(routes);

// create session/connect session to our sequelize database
const sess = {
    secret: 'Super secret secret',
    cookie: {},
    resave: false,
    saveUninitialized: true,
    store: new SequelizeStore({
      db: sequelize
    })
  };

// start a session
app.use(session(sess));

// turn on connection to db and server (sequelize)
// sync: connects our classes to the db tables || create db tables if none
// {force:false}: optional. if true, will drop and recreate db of all tables on startup. (Equiv to DROP TABLE IF EXISTS)
sequelize.sync({force: false})
    .then(() => {
        app.listen(PORT, () => console.log('Now listening'));
    });