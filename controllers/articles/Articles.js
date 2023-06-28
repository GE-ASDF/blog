const express = require("express")
const router = express.Router();
const Category = require("../../models/Category")
const Article = require("../../models/Article")
const {check, validationResult} = require("express-validator")
const slugify = require("slugify");
const Auth = require("../../middlewares/Auth");
const dateObj = new Date();
const date = dateObj.toLocaleDateString('pt-Br').split("/").reverse().join("-")
const hour = dateObj.toLocaleTimeString("pt-br")
const updateAt = `${date} ${hour}`;

router.get("/admin/articles",Auth ,(req, res)=>{
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

router.get("/admin/articles/new",Auth, (req, res)=>{
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

router.get("/admin/articles/edit/:id",Auth,
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
                    categoryIdError: req.flash("categoryIdError"),
                    articleIdError: req.flash("articleIdError"),
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

router.post("/admin/articles/save", Auth,
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

router.post("/admin/articles/delete", Auth,
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

router.post("/admin/articles/update",Auth,
[
    check("title").notEmpty().isLength({min:4}).trim().escape(),
    check('body').notEmpty(),
    check('categoryId').notEmpty().isInt().trim().escape(),
    check('articleId').notEmpty().isInt().trim().escape(),
], (req, res)=>{
    const errors = validationResult(req);
    let {title, body, categoryId, articleId} = req.body;
    if(!errors.isEmpty()){
        req.flash("title", "Este campo é obrigatório.")
        req.flash("body", "Este campo é obrigatório.")
        req.flash("categoryId", "Este campo é obrigatório.")
        res.redirect(`/admin/articles/edit/${articleId}`)
        return;
    }
    Category.findByPk(categoryId)
    .then((category)=>{
        if(category){
            Article.findByPk(articleId)
            .then((article)=>{
                if(article){
                    Article.update({
                        body,
                        title,
                        categoryId,
                        slug: slugify(title),
                        updateAt,
                    },{where:{id: articleId}})
                    .then(()=>{
                        req.flash("success", "Sucesso! O artigo foi atualizado.")
                        res.redirect(`/admin/articles/edit/${articleId}`)
                        return;
                    }).catch(()=>{
                        req.flash("error", "Falha! O artigo não foi atualizado.")
                        res.redirect(`/admin/articles/edit/${articleId}`)
                        return;
                    })
                }else{
                    req.flash("articleIdError", "O artigo informado não existe.")
                    res.redirect(`/admin/articles/edit/${articleId}`)
                    return;
                }
            }).catch(()=>{
                req.flash("articleIdError", "Ocorreu um erro ao buscar o artigo.")
                res.redirect(`/admin/articles/edit/${articleId}`)
                return;
            })
        }else{
            req.flash("categoryIdError", "A categoria informada não existe.")
            res.redirect(`/admin/articles/edit/${articleId}`)
            return;
        }
    }).catch(()=>{
        req.flash("categoryIdError", "Ocorreu um erro ao buscar a categoria.")
        res.redirect(`/admin/articles/edit/${articleId}`)
        return;
    })
   
})

router.get("/articles/page/:num",Auth,[
    check('num').notEmpty().isInt().trim().escape()
], (req, res)=>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        req.flash("error", "Erro ao buscar artigos.");
        res.redirect(`/admin/articles`)
        return;
    }
    let page = req.params.num;
    let offset = 0;
    let next;
    if(page == 1){
        offset = 0;
    }else{
        offset = page * 4;
    }
   
    Article.findAndCountAll({
        limit: 4,
        offset,
    })
    .then((articles)=>{
        if(offset + 4 >= articles.count){
            next = false;
        }else{
            next = true;
        }
        let result = {
            next,
            articles,
        }
        res.json(result);
    })
    .catch(()=>{
        req.flash("error", "Artigos não encontrados.");
        res.render("/admin/articles");
    })
})


module.exports = router;