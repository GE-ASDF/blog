const {check, validationResult} = require("express-validator")
const express = require("express");
const router = express.Router();
const { Op } = require("sequelize");
const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const Csrf = require("../../classes/Csrf");

router.get("/admin/login", (req, res) =>{
    if(req.session.user == undefined){
        const token = Csrf();
        req.session.token = token,
        res.render("login",{
            titlePage: "Acesso restrito",
            token,
            error:req.flash("error"),
        })
    }else{
        res.redirect("/admin/categories");
    }
})

router.get("/admin/users/create", (req, res)=>{
    res.render("pages/admin/users/Create",{
        titlePage:"Cadastro de usuários",
        error: req.flash("error"),
        success: req.flash("success"),
    })
})

router.get("/admin/users", (req, res)=>{
    User.findAll()
    .then((users)=>{
        res.render("pages/admin/users/Index",{
            titlePage:'Lista de usuários',
            users,
            error:req.flash("error"),
            success:req.flash("success"),
        })
    })
})
router.post("/admin/logar", [
    check("email").notEmpty().isEmail().trim().escape(),
    check('password').notEmpty().trim().escape(),
    check("token").notEmpty()
],(req, res)=>{
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        req.flash("error", "Os dados informados são inválidos.");
        res.redirect("/admin/login");
        return;
    }
    let {password, email, token} = req.body;
    if(req.session.token != token){
        req.session.token = undefined;
        req.flash("error", "Dados inválidos. Tente novamente.")
        res.redirect("/admin/login");
        return;
    }

    User.findOne({where: {email}})
    .then((user)=>{
        if(user != undefined){
            const correct = bcrypt.compareSync(password, user.password);
            if(correct){
                req.session.user = {
                    id:user.id,
                    name:user.name,
                    email: user.email
                }
                res.redirect("/admin/categories");
                return;
            }else{
                req.flash("error", "Verifique se os dados informados estão corretos.")
                res.redirect("/admin/login")
            }
        }else{
            req.flash("error", "Usuário não encontrado.")
            res.redirect("/admin/login")
        }
    })
})
router.post("/admin/users/save",
[
    check('name').notEmpty().isLength({min:2}).trim().escape(),
    check('email').notEmpty().isEmail().trim().escape(),
    check("password").notEmpty().trim().escape(),
    
], (req, res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        req.flash("error", "Os dados informados são inválidos.");
        res.redirect("/admin/users/create");
        return;
    }
    let {name, email, password} = req.body;
   
    let salt = bcrypt.genSaltSync(10);
    password = bcrypt.hashSync(password, salt);
    User.findOne({where:{email}})
    .then((user)=>{
        if(user != undefined){
            req.flash("error", "Este e-mail já está cadastrado no nosso banco de dados.");
            res.redirect("/admin/users/create")
            return;
        }
        User.create({
            name,
            email,
            password
        }).then(()=>{
            req.flash("success", "Usuário criado com sucesso.");
            res.redirect("/admin/users/create")
            return;
        }).catch(()=>{
            req.flash("error", "Ocorreu um erro na hora de cadastrar o usuário. Tente novamente!");
            res.redirect("/admin/users/create");
            return;
        })
    })

})
router.post("/admin/users/logout", (req, res)=>{
    if(req.session.user != undefined){
        req.session.user = undefined;
        res.redirect("/admin/login");
        return;
    }else{
        res.redirect("/admin/login");
        return;
    }
})
module.exports = router;