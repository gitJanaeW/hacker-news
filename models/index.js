const User = require('./User');
const Post = require('./Post');
const Vote = require('./Vote');

// create one-to-many association
User.hasMany(Post, {
    foreignKey: 'user_id'
});

Post.belongsTo(User, {
    foreignKey: 'user_id'
});

// create many-to-many association
// association to see which users commented on a post:
User.belongsToMany(Post, {
    through: Vote,
    as: 'voted_posts',
    foreignKey: 'user_id'
});
// association to see which posts a user commented on
Post.belongsToMany(User, {
    through: Vote,
    as: 'voted_posts',
    foreignKey: 'post_id'
});

Post.hasMany(Vote, {
    foreignKey: 'user_id'
});

User.hasMany(Vote, {
    foreignKey: 'post_id'
});

module.exports = {User, Post, Vote};