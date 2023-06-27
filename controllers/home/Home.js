const {check, validationResult} = require("express-validator")
const express = require("express");
const Category = require("../../models/Category");
const Article = require("../../models/Article");
const router = express.Router();

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

module.exports = router;