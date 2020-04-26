'use strict';
require('dotenv').config();
const express = require('express');
const pg = require('pg');
const methodOverride=require('method-override');
const superagent = require('superagent');
const PORT = process.env.PORT||3000;


const app =express();
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static('./public')); 
app.set('view engine', 'ejs');
const clint = new pg.Client(process.env.DATABASE_URL);
clint.on('error',(err)=>console.log(err));

app.get('/',home);
app.post('/favorite',favorite);
app.get('/favorite',favorite1);
app.get('/details/:id',details);
app.put('/update/:id',update);
app.delete('/delete/:id',deletedigi);
function deletedigi(req,res){
    const SQL = 'DELETE FROM digi WHERE id=$1';
    const val=[req.params.id];
    clint.query(SQL,val)
    .then((data)=>{
            res.redirect(`/favorite`);
    })
}
function update(req,res){
    const {name,img,level}=req.body;
    const SQL = 'UPDATE digi set name=$1,img=$2,level=$3 WHERE id=$4';
    const val=[name,img,level,req.params.id];
    clint.query(SQL,val)
    .then((data)=>{
            res.redirect(`/details/${req.params.id}`);
    })
}
function details(req,res){
    const SQL = 'SELECT * FROM digi WHERE id=$1';
    const val=[req.params.id];
    clint.query(SQL,val)
    .then((data)=>{
            res.render('details',{digimon:data.rows[0]});
    })
}
function favorite1(req,res){
    const SQL2 = 'SELECT * FROM digi'
    clint.query(SQL2)
    .then((data)=>{
        res.render('favorite',{digimons:data.rows});})
}
function favorite(req,res){
    const {name ,img ,level } = req.body;
    const SQL = 'INSERT INTO digi (name,img,level) VALUES ($1,$2,$3);';
    const val=[name ,img ,level ];
    clint.query(SQL,val)
    .then(()=>{
        const SQL2 = 'SELECT * FROM digi'
        clint.query(SQL2)
        .then((data)=>{
            res.render('favorite',{digimons:data.rows});
    })
    })
}
function home(req,res){
    Digimon.all=[];
    const URL = 'https://digimon-api.herokuapp.com/api/digimon';
    superagent.get(URL)
    .then(data=>{
        data.body.forEach(element => {
            let digimon = new Digimon(element);
            Digimon.all.push(digimon);
        });
        // console.log(Digimon.all);
        res.render('index',{digimons:Digimon.all});
    })
    
}
clint.connect(()=>{
    app.listen(PORT,()=>{
        console.log(`running in port ${PORT}`);
    })
})

function Digimon(obj){
    this.name=obj.name;
    this.img=obj.img;
    this.level=obj.level;
}
Digimon.all=[];