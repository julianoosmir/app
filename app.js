//carregando modulos
const express = require('express')
const handlebars = require('express-handlebars')
const bodyParser = require("body-parser")
const app = express()
const admin = require("./rotues/admin")
const path = require('path');
const mongoose = require("mongoose")
const session = require("express-session")
const flash = require("connect-flash")
require("./models/Postagem")
const Postagem = mongoose.model("postagens")
require("./models/Categoria")
const Categoria = mongoose.model("categorias")
const usuarios = require("./rotues/usuario")
const passport = require("passport")
require("./config/auth")
const db = require("./config/db")
// const mongoose = require ("mongoose")
//configuraçao
app.use(session({
    secret:"aprendendonode",
    resave : true,
    saveUninitialized: true
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())
//Middlewares
app.use ((req,res, next) => {
    res.locals.success_msg = req.flash("success_msg")
    res.locals.error_msg = req.flash("error_msg")
    res.locals.erroe = req.flash("error")
    res.locals.user = req.user || null;
    next();
})
// Body Parser
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
//handlebars
app.engine('handlebars', handlebars({defaultLayout : 'main'}))
app.set('view engine','handlebars');
//mongoose  
mongoose.promesse = global.promesse;
mongoose.connect(db.mongoURI).then(() =>{
    console.log("mongo conectado")
}).catch((erro) => {
    console.log("erro   ao se conectar : "  + erro )
})
//public

app.use(express.static('public'));
app.use((req,res,next) =>{
    console.log("oi sou middleware")
    next();
})

//rotas
app.get('/',(req,res)=>{
    Postagem.find().populate("categoria").sort({data: "desc"}).then((postagens)=>{
        res.render("index", {postagens: postagens})
    }).catch((erro)=>{
        req.flash("error_msg", "houve um erro interno")
        res.redirect("/404")
    })
    
})
app.get("/postagem/: slug", (req,res)=>{
    Postagem.findOne({slug: req.params.slug}).then((postagens)=>{
        if(postagem){
            res.render("postagem/index", {postagem: postagem})
        }else{
            req.flash("error_msg","Esta postagem nao existe")
            res.redirect("/") 
        }
    }).catch((erro)=> {
        req.flash("error_msg", "houve um erro interno")
        res.redirect("/")
    })
})

app.get("/categorias", (req,res)=>{
Categoria.find().then((categorias)=>{
res.render("categorias/index", {categorias : categorias})
}).catch((erro)=>{
    require.flash("error_msg","houve um erro interno ao listar as categorias:" + erro)
    res.redirect("/")
})
})
app.get("/categorias/:slug", (req,res)=>{
Categoria.findOne().then((categoria)=>{
if(categoria){
    Postagem.find({categoria: Categoria._id}).then((postagens)=>{
        res.render("categorias/postagens",)
    }).catch((erro)=>{
        req.flash("error_msg", "houve um erro ao listar os posts!")
        res.redirect("categorias/postagens", {postagens: postagens, categoria : Categoria})
    })
}else{
    req.flash("error_msg", "Esta categoria nao existe")
    res.redirect("/")
}
}).catch((erro)=>{
    require.flash("error_msg","houve um erro interno ao carregar pagina categorias:" + erro)
    res.redirect("/")
})
})

app.get("/404",(req,res)=>{
    res.send('Erro 404!')
})
app.get('/posts',(req,res)=>{
    res.send("listas Posts")
})
app.use('/admin', admin)
app.use("/usuarios", usuarios)
//outros
const PORT  = process.env.PORT || 8081
app.listen(PORT,()=>{
    console.log("servidor rodando")
})
//https://downloads.mongodb.org/win32/mongodb-shell-win32-x86_64-2012plus-4.2.3.zip