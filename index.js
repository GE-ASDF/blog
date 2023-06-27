const CategoriesController = require("./controllers/categories/Categories");
const HomeController = require("./controllers/home/Home");
const ArticlesController = require("./controllers/articles/Articles");
const Category = require("./models/Category");
const Article = require("./models/Article");
const { Op } = require("sequelize");
const {app} = require("./src/app");
const {check, validationResult} = require("express-validator");


app.use("/", CategoriesController)
app.use("/", HomeController);
app.use("/", ArticlesController);


app.get("/:slug",[
    check('slug').notEmpty().trim().escape()
], (req, res)=>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        req.flash("error", "Artigo não encontrado");
        res.redirect("/");
        return;
    }
    const slug = req.params.slug;
    Article.findOne({
        where:{
            slug
        }
    }).then((article)=>{
        Article.findAll({
            where:{
                [Op.not]:[{slug}]
            }
        }).then((otherArticles)=>{
            if(article != undefined){
                res.render("pages/client/articles/Index", {
                    article,
                    titlePage: article.title,
                    otherArticles,
                });
            }else{
                req.flash("error", "Artigo não encontrado");
                res.redirect("/");
                return;
            }
        })        
    }).catch(()=>{
        req.flash("error", "Artigo não encontrado");
        res.redirect("/");
        return;
    })
})