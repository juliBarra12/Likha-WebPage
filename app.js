require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const nodeMailer = require("nodemailer");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.route("/")
.get(function(req, res){
    res.sendFile(__dirname + "/index.html")
})
.post(function (req, res){
    let data = req.body;
    let smtpTransport = nodeMailer.createTransport({
        service: "Gmail",
        port: 465,
        auth: {
            user: process.env.GMAIL_ACCOUNT,
            pass: process.env.GMAIL_PASSWORD
        }
    });
    let mailOptions = {
        from: data.email,
        to: 'codingjuliet@gmail.com',
        subject: `Mensaje de ${data.nombre} ~ via Likha Web Page`,
        html: `
            <h3>Información</h3>
                <ul>
                    <li>Nombre: ${data.nombre}</li>
                    <li>Email: ${data.email}</li>
                    <li>Telefono: ${data.telefono}</li>
                </ul>

                <h3>Mensaje</h3>
                <p>${data.mensaje}</p>
        `    
    };
    smtpTransport.sendMail(mailOptions, function(e, res){
        if(e){
            console.log("Error");
        } else {
            console.log("Success");
        }
    });
    smtpTransport.close();
    res.redirect("/")
});


app.listen(process.env.PORT || 3000, function(){
    console.log("server is running on port 3000")
});