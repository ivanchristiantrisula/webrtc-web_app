import express from "express";
const {MongoClient} = require("mongodb");
let mongoose = require("mongoose");
import dotenv from "dotenv";
let User = require("../models/userModel");
const bcrypt = require("bcrypt");


let app = express.Router();
dotenv.config();


app.post("/register",async (req,res)=>{
    let email = req.body.email;
    let password = req.body.password;
    let confirm = req.body.confirm;
    let name = req.body.name;
    

    if(password===confirm){
        let newUser = new User({
            name : name,
            password : await bcrypt.hash(password, 10),
            email : email,
            friends : [],
            blocks : []
        })
        newUser.save(function(err,u){
            if (err) return res.status(400).send({errors : [err.message]});
            return res.status(200).send("OK")
        })
    }else{
        res.status(400).send({
            errors : ["Confirm Password doesn't match Password"]
        })
    }
    
});

app.post("/login", async(req,res)=>{
    let email = req.body.email;
    let password = req.body.password;

    User.findOne({email : new RegExp(email, 'i')},function(err,doc){
        if(err) return res.status(400).send({errors : err});
        if(doc != null){
            bcrypt.compare(password,doc.password,(err,result)=>{
                if (err) return console.log(err);
                if(result){
                    let token = require("../library/generateToken")(doc)
                    res.cookie("token",token, { httpOnly: false })
                    res.status(200).end();
                }else{
                    res.status(401).send({errors : ["Wrong email or password"]});
                }
            })
        }else{
            res.status(401).send({errors : ["User not found!"]});
        }
        
        

    })
})

app.get("/testCookie",(req,res)=>{
    console.log(req.cookies);
})


module.exports = app;