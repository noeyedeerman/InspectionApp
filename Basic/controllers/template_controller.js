var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var template = require('../models/template.js');

router.get('/templates', function (req, res) {
    res.render('template');
});


    // const newTemp = new template({

    // })
    // //saves data to mongoose
    // newTemp.save().then(result => {
    //     console.log(result);
    //     res.status(201).json({
    //         message: "Handling POST request to /api/registration. New Manager created",
    //         createdRegistration: newReg
    //     });
    // }).catch(err => {
    //     catchError(err);
    // });


module.exports = router;