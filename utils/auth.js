const withAuth = (req, res, next) => {
    // if no user id exists in req.session, send to login page
    if (!req.session.user_id) {
        res.direct('/login');
    } // else, take the req and res data gathered and send it to the next route (whatever that route was)
    else {
        next();
    }
};

module.exports = withAuth;