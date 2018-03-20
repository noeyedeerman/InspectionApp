const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const cryptoRanString = require('crypto-random-string');
const { check, validationResult } = require('express-validator/check');
const jwt = require('jsonwebtoken');
const passport = require('passport');

const newManager = require('../models/user.js');

const router = express.Router();



//Route to index page
router.get('/', function(req,res){
    res.render("index");
});
//add express validation later to login and registration... can also use this for adding units as well
router.post('/register', (req,res) => {
    console.log(req.body); 
    
    bcrypt.genSalt(6, (err,salt) =>{
        if(err){
            return res.status(500).json({
                error:err
            });
        }else{
            // console.log(req.body.password);
            
            bcrypt.hash(req.body.password, salt, null, (err, hash) => {
                console.log("bcrypt has hashed password");
                
                if (err) {
                    return res.status(500).json({
                        error: err
                    });
                } else {
                    const user_ID = cryptoRanString(10);
                    const man_ID = cryptoRanString(10);
                    const newReg = new newManager({
                        type: "Admin",
                        manager_U_id: man_ID,
                        user_U_id: user_ID,
                        firstName: req.body.firstName,
                        lastName: req.body.lastName,
                        username: req.body.username,
                        password: hash,
                        company: req.body.company,
                        email: req.body.email,
                        phoneNumber: req.body.phoneNumber
                    });
                        //saves data to mongoose
                    newReg.save().then(result => {
                        console.log(result);
                        res.status(201).json({
                            message: "Handling POST request to /api/registration. New Manager created",
                            createdRegistration: newReg
                        });
                    }).catch(err => {
                       catchError(err);
                    });
                }
            });   
        }    
    }); 
});

//Route to home page from login. Sends user JWT back to client to use for authentication
router.post('/login', (req,res,next) => {
 
    let name = req.body.username;
    console.log(name);    
    
    newManager.findOne({ username: name}).exec().then(user => {
         console.log( user.password);
         console.log("password inptted in", req.body.userpass);
        if(user.length < 1){
            return res.status(401).json({
                message: 'Auth failed'
            });           
        }        
        bcrypt.compare(req.body.userpass, user.password, (err,result) => {
            if(err){
                return res.status(401).json({
                    message: 'Auth failed'
                });
            }
            if(result){
               const token = jwt.sign({
                    email: user.email,
                    manID: user.manager_U_id,
                    uID: user.user_U_id,
                    type: user.type,
                    username: user.username
                }, process.env.JWT_Key,
                //define the options
                {
                    expiresIn: "4h"
                }
                );
                console.log("token created");
                console.log(token);  
                const man_id = user.manager_U_id;
                console.log(man_id);
                
                req.login(man_id, (err)=>{
                    
                });             

                return res.status(200).json({
                    message: 'Auth successful',
                    token: token,
                    authTok: user.user_U_id
                });
               
            }
            res.status(401).json({
                message: 'Auth failed'
            });
        });
    }).catch(err =>{
        catchError(err);
    });
});

passport.serializeUser((token,done)=>{
    done(null,man_id);
});
passport.deserializeUser((token,done)=>{
    done(null,man_id);
});
 
function createCookie(name,value,days){
    if(days){
        var date = new Date();
        date.setTime(date.getTime()+(days*24*60*60*1000));
        var expires = "; expires ="+date.toGMTString();
    }else{
        var expires = "";
        document.cookie = name+"="+value+expires+"; path =/";
    }
}
function readCookie(name){
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++){
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if(c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null
}
function eraseCookie(name){
    createCookie(name,"",-1);
}
function catchError(err){
    console.log(err);
    res.status(500).json({
        error: err
    });
}

module.exports = router;