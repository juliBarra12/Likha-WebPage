require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const nodeMailer = require("nodemailer");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

const oauth2Client = new OAuth2(
    //ClientID
    process.env.GOOGLE_CLIEND_ID,
    //Client Secret
    process.env.GOOGLE_CLIENT_SECRET,
    //Redirect URL
    "https://developers.google.com/oauthplayground"

);

oauth2Client.setCredentials({
    refresh_token: process.env.REFRESH_TOKEN
});
const accessToken = oauth2Client.getAccessToken();

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
            type: "OAuth2",
            user: "likha.webpage2021@gmail.com",
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            refreshToken: process.env.REFRESH_TOKEN,
            accessToken: accessToken,
            
        },
        tls: {
            rejectUnauthorized: false
        }
    });
    let mailOptions = {
        from: "likha.webpage2021@gmail.com",
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
        e ? console.log(e) : console.log(res);
        smtpTransport.close();
    });
    
    res.redirect("/")
});


app.listen(process.env.PORT || 3000, function(){
    console.log("server is running on port 3000")
});