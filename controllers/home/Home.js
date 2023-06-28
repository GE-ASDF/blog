const {check, validationResult} = require("express-validator")
const express = require("express");
const Category = require("../../models/Category");
const Article = require("../../models/Article");
const router = express.Router();
const { Op } = require("sequelize");

router.get("/", /* INÍCIO DA VALIDAÇÃO */ 
[
    
]
, /* FIM DA VALIDAÇÃO */ (req, res)=>{
    Category.findAll({raw:true})
    .then((categories)=>{
        Article.findOne({limit:1,order:[['createdAt', 'DESC']]})
        .then((mostRecent)=>{
            Article.findAll().then((articles)=>{
                res.render("index",{
                    titlePage:"Página inicial",
                    categories,
                    mostRecent,
                    articles,
                    error:req.flash('error')
                });
            })
        })
    })
})

router.get("/:slug",[
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

router.get("/category/:slug", [
    check('slug').notEmpty().trim().escape(),
], (req,res)=>{
    let slug = req.params.slug;
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        req.flash("error", "Artigo não encontrado");
        res.redirect("/");
        return;
    }
    Category.findOne({where:{slug}, include:{model:Article}})
    .then((category)=>{
        if(category != undefined){
            Category.findAll()
            .then((categories)=>{
                Article.findOne({limit:1, order:[['createdAt', 'DESC']]})
                .then((mostRecent)=>{
                    res.render("index", {mostRecent,titlePage: 'Página inicial',error:req.flash('error'),categories, articles: category.articles})
                }).catch(()=>{
                    req.flash("error", "Nenhum artigo foi encontrado");
                    res.redirect("/");
                    return;
                })
            })
        }else{
            req.flash("error", "Artigo não encontrado");
            res.redirect("/");
            return;
        }
    }).catch(()=>{
        req.flash("error", "Artigo não encontrado");
        res.redirect("/");
        return;
    })
})

module.exports = router;