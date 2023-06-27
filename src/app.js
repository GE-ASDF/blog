require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT_EXPRESS || 3000;
const body = require("body-parser");
const flash = require("connect-flash");
const session = require("express-session");
const connection = require("../core/Model");

// Conexão com o banco de dados
connection
.authenticate()
.then(()=>{
    console.log("Conexão com o banco de dados realizada com sucesso");
})
.catch((err)=>{
    console.log("A conexão com o banco de dados não foi realizada:", err);
})

app.use(session({
    secret: "flashlog",
    saveUninitialized: true,
    resave:true,
}));

app.use(body.urlencoded({extended: false}))
app.use(body.json());
app.use(express.static("public"));
app.use(flash());
app.set("view engine", "ejs");

app.listen(port, (err)=>{
    if(err != null){
        console.log("O servidor não está rodando.")
    }else{
        console.log("O servidor está rodando na porta: ", port);
    }
})

module.exports = { app, connection }