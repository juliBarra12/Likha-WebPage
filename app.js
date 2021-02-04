const express = require("express");
const bodyParser = require("body-parser");
const nodeMailer = require("nodemailer");


const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.route("/")
.get(function(req, res){
    res.sendFile(__dirname + "/index.html")
})
.post(function (req, res){

});


app.listen(3000, function(){
    console.log("server is running on port 3000")
});