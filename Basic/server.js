const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

let app = express();

let PORT = process.env.PORT || 3000;

//app.use(express.static('public'));

app.get('/', function(req,res){
    res.sendFile(path.join(__dirname,"index.html"));
});

app.listen(PORT, function(){
    console.log("App is listening on PORT" + PORT);
});