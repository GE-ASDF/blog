const express = require("express")
const router = express.Router();
const Category = require("../../models/Category")
const Article = require("../../models/Article")
const {check, validationResult} = require("express-validator")
const slugify = require("slugify");

router.get("/admin/articles", (req, res)=>{
    Article.findAll({
        include:[{model: Category}]
    })
    .then((articles)=>{
        res.render("pages/admin/articles/Index",{
            titlePage: 'Lista de artigos',
            articles,
            error:req.flash("error"),
            success:req.flash("success"),
        })
    })
})

router.get("/admin/articles/new", (req, res)=>{
    Category.findAll()
    .then((categories) => {
        if(categories.length > 0){
            res.render("pages/admin/articles/Create",{
                titlePage:"Cadastro de artigo",
                success:req.flash("success"),
                error:req.flash("error"),
                categories,
                body: req.flash("body"),
                title: req.flash("title"),
            })
        }else{
            req.flash("error", "Antes de criar um artigo é necessário ter categorias cadastradas.")
            res.redirect("/admin/categories/new");
        }

    });
    
})

router.get("/admin/articles/edit/:id",
[
    check('id').notEmpty().isInt().trim().escape(),
],
(req, res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        req.flash("error", "Nenhuma categoria foi encontrada.")
        res.redirect("/admin/articles");
        return;
    }
    const id = req.params.id;
    Article.findByPk(id).then(article =>{
        Category.findAll().then((categories)=>{
            if(article != undefined){
                res.render("pages/admin/articles/Edit", {
                    titlePage: 'Atualização de registro',
                    id: article.id,
                    title: article.title,
                    body: article.body,
                    categoryId: article.categoryId,
                    categories,
                    success: req.flash('success'),
                    error: req.flash('error'),
                })
            }else{
                req.flash("error", "Nenhuma categoria foi encontrada.")
                res.redirect("/admin/articles");
            }
        }).catch(()=>{
            req.flash("error", "Nenhuma categoria foi encontrada.")
            res.redirect("/admin/articles");
        })
      
    }).catch(()=>{
        req.flash("error", "Nenhuma categoria foi encontrada.")
        res.redirect("/admin/articles");
    })
})

router.post("/admin/articles/save", 
[
    check('categoryId').notEmpty().isInt().trim().escape(),
    check("title").notEmpty().isLength({min:4}).trim().escape(),
    check('body').notEmpty(),

],(req, res)=>{
    const errors = validationResult(req);
    const categoryId = req.body.categoryId
    const title = req.body.title
    const body = req.body.body

    if(!errors.isEmpty()){
        req.flash("body", body)
        req.flash("title", title)
        req.flash("error", "Verifique os campos e tente novamente.")
        res.redirect("/admin/articles/new");
        return;
    }

    Category.findOne({where:{id: categoryId}})
    .then((category)=>{
        if(category){
           Article.create({
            title,
            body,
            slug: slugify(title),
            categoryId
           }).then(()=>{
            req.flash("success", "Sucesso! O seu artigo foi publicado.")
            res.redirect("/admin/articles/new");
           })
        }else{
            req.flash("error", "Verifique os campos e tente novamente.")
            res.redirect("/admin/articles/new");
            return;
        }
    })
    .catch(()=>{
        req.flash("error", "Verifique os campos e tente novamente.")
        res.redirect("/admin/articles/new");
        return;
    })
})

router.post("/admin/articles/delete", 
[
    check('id').notEmpty().isInt().trim().escape(),
], (req, res)=>{
    const errors = validationResult(req);
    const id = req.body.id;
    if(!errors.isEmpty()){
        req.flash("error", "Não possível apagar o registro.");
        res.redirect("/admin/articles");
        return;
    }
    Article.destroy({
        where:{id: id}
    }).then(()=>{
        req.flash("success", "Sucesso! O artigo foi apagado.");
        res.redirect("/admin/articles");
        return;
    }).catch(()=>{
        req.flash("error", "Não possível apagar o registro.");
        res.redirect("/admin/articles");
        return;
    })
})


module.exports = router;