const Sequelize = require("sequelize");
const connection = require("../core/Model");
const Category = require("./Category");

const Article = connection.define('articles',{
    title:{
        type: Sequelize.STRING,
        allowNull: false,
    },
    slug:{
        type:Sequelize.STRING,
        allowNull: false,
    },
    body:{
        type: Sequelize.TEXT,
        allowNull: false,
    }

});

Category.hasMany(Article);
Article.belongsTo(Category);

module.exports = Article;