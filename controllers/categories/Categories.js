const express = require("express");
const router = express.Router();
const Category = require("../../models/Category");
const slugify = require("slugify");
const {check, validationResult} = require("express-validator");

// ROTAS GET
router.get("/admin/categories", (req, res)=>{
    Category.findAll().then((categories)=>{

        res.render("pages/admin/categories/Index", 
        {
            titlePage: "Lista de categorias",
            categories,
            error:req.flash("error"),
            success:req.flash("success")
        });
    })
})

router.get("/admin/categories/new", (req, res)=>{
    res.render("pages/admin/categories/Create",{
        titlePage: "Cadastro de categorias",
        success: req.flash("success"),
        error: req.flash("error"),
    })
})

router.get("/admin/categories/edit/:id",
[
    check('id').notEmpty().isInt().trim().escape(),
],
(req, res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        req.flash("error", "Nenhuma categoria foi encontrada.")
        res.redirect("/admin/categories");
        return;
    }
    const id = req.params.id;
    Category.findByPk(id).then(category =>{
        if(category != undefined){
            res.render("pages/admin/categories/Edit", {
                titlePage: 'Atualização de registro',
                id: category.id,
                title: category.title,
                success: req.flash('success'),
                error: req.flash('error'),
            })
        }else{
            req.flash("error", "Nenhuma categoria foi encontrada.")
            res.redirect("/admin/categories");
        }
    }).catch(()=>{
        req.flash("error", "Nenhuma categoria foi encontrada.")
        res.redirect("/admin/categories");
    })
})

// ROTAS POSTS

router.post("/admin/categories/save",[
    check('title').notEmpty().isLength({min: 4, max:255}).trim().escape(),
], (req, res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        req.flash("error", "O título da categoria é obrigatório e deve conter no mínimo 4 e no máximo 255 caracteres.")
        res.redirect("/admin/categories/new");
        return;
    }
    const title = req.body.title;
    Category.create({
        title,
        slug: slugify(title),
    }).then((res)=>{
        if(res){
            req.flash("success", "Sucesso! A categoria foi criada.");
            res.redirect("/admin/categories/new");
        }else{
            req.flash("error", "Ocorreu um erro ao cadastrar a categoria, por favor, tente novamente.")
            res.redirect("/admin/categories/new");
        }
    }).catch(()=>{
        req.flash("error", "Ocorreu um erro ao cadastrar a categoria, por favor, tente novamente.")
        res.redirect("/admin/categories/new");
    })
})

router.post("/admin/categories/update",[
    check('title').notEmpty().isLength({min: 4, max:255}).trim().escape(),
    check('id').notEmpty().isInt().trim().escape(),
], (req, res)=>{
    const errors = validationResult(req);
    const title = req.body.title;
    const id = req.body.id;
    if(!errors.isEmpty()){
        req.flash("error", "O título da categoria é obrigatório e deve conter no mínimo 4 e no máximo 255 caracteres.")
        res.redirect(`/admin/categories/edit/${id}`);
        return;
    }
    Category.update({
        title,
        slug: slugify(title),
    },  {where:{id}})
    .then(()=>{
        req.flash("success", "Sucesso! A categoria foi atualizada.");
        res.redirect(`/admin/categories/edit/${id}`);
    }).catch(()=>{
        req.flash("error", "Ocorreu um erro ao atualizar a categoria, por favor, tente novamente.")
        res.redirect(`/admin/categories/edit/${id}`);
    })
})

router.post("/admin/categories/delete", 
[
    check('id').notEmpty().isInt().trim().escape(),
], (req, res)=>{
    const errors = validationResult(req);
    const id = req.body.id;
    if(!errors.isEmpty()){
        req.flash("error", "Não possível apagar o registro.");
        res.redirect("/admin/categories");
        return;
    }
    Category.destroy({
        where:{id: id}
    }).then(()=>{
        req.flash("success", "Sucesso! A categoria foi apagada.");
        res.redirect("/admin/categories");
    }).catch(()=>{
        req.flash("error", "Não possível apagar o registro.");
        res.redirect("/admin/categories");
    })
})

module.exports = router;