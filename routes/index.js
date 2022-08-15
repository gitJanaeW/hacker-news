const router = require('express').Router();
const apiRoutes = require('./api');

router.use('/api', apiRoutes);
// Catch error in case of non-existent endpoint
router.use((req, res) => {
    res.status(404).end();
})

module.exports = router;