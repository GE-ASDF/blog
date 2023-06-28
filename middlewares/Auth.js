function Auth(req, res, next){
    if(req.session.user != undefined){
        next();
    }else{
        req.flash("error", "Usuário não logado.");
        res.redirect("/");
        return;
    }
}


module.exports = Auth;