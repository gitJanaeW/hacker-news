const {Model, DataTypes} = require('sequelize');
const sequelize = require('../config/connection');

class Vote extends Model {
    // static: indicates here that the "upvote" method is based on the Post class and not based on indivdual Post objs
    static upvote(body, models) {
        return models.Vote.create({
            user_id: req.body.user_id,
            post_id: req.body.post_id
          })
            .then(() => {
              // then find the post we just voted on
              return Post.findOne({
                where: {
                  id: req.body.post_id
                },
                attributes: [
                    'id',
                    'post_url',
                    'title',
                    'created_at',
                    // use raw MySQL to query the amount of votes the post has and add it to the post obj under the name `vote_count`
                    [
                        sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'),
                        'vote_count'
                    ]
                ]
            });
        })
    }
}

Vote.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'user',
                key: 'id'
            }
        },
        post_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'post',
                key: 'id'
            }
        }
    },
    {
        sequelize,
        timestamps: false,
        freezeTableName: true,
        underscored: true,
        modelName: 'vote'
    }
);

module.exports = Vote;