const express = require('express');
const cors = require('cors');
var bodyParser = require("body-parser");
const app = express();
const { Router, text } = require('express');

var bodyParser = require("body-parser");

//Variables de Entorno
const ip   = process.env.NODEIP || "182.18.7.7";
const port = process.env.NODEPORT || 4500;

//Creando Ruta
app.set('port',4500);
app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/AnalizarJison/',function(req,res){
    var entrada=req.body.text;
    //var respuesta= Analizador(entrada);
    //res.send(respuesta.toString());
});

app.get('/', (req, res)=>{
    res.send("Holi2");    
});



//Levantando el Servidor
app.listen(port, function(){
    console.log('Listen in port'+port)
});