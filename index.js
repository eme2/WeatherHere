//const { response } = require('express');

// suite : https://www.youtube.com/watch?v=ZtLVbJk7KcM  6'47

// https://cdn.jsdelivr.net/npm/p5@1.2.0/lib/p5.min.js
const http = require('http');
const https = require('https');
const fs = require('fs');
const fetch = require('node-fetch');
require('dotenv').config();

console.log(process.env);
const apiKey = process.env.API_KEY;
// const URLweather = "api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${apiKey}&units=metric&lang=fr"

// api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API key}&units=metric&lang=fr
// apiKey : 36e306cb2eda31ad3dec79db153557c2
// 48.6333756, 7.7427876

// api.openweathermap.org/data/2.5/weather?lat=48.6333756&lon=7.7427876&appid=36e306cb2eda31ad3dec79db153557c2

// const op

var express = require('express');
var Datastore = require('nedb');
var app = express();
const Database = new Datastore('database.db');
Database.loadDatabase();

app.use(express.static('public'));

app.use(express.json({limit: '1mb'}));
//app.use(express.urlencoded({extended: true}));

app.get('/api', (req,res) => {
    Database.find({}, (err, data) => {
        if (err) {
            res.end();
            return;
        }
        console.log(data);
        res.json(data);
    })
});

app.get('/weather/:latlon', async (req, res)=> {
    const latlon = req.params.latlon.split(',');
    const lat = latlon[0];
    const lng = latlon[1];
    console.log(latlon);
    console.log("Weather api");
    console.log(req.body);
    const URLweather = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${apiKey}&units=metric&lang=fr`;
    const response = await fetch(URLweather);
    const json = await response.json();
    //console.log(json);
    const URLtp = "https://api.thingspeak.com/channels/507685/feeds.json?results=1";
    const response_tp = await fetch(URLtp);
    const json_tp = await response_tp.json();
    console.log(json_tp);
    let moment = new Date(json_tp.feeds[0].created_at);
    moment = new Date();
    console.log(moment);
    console.log(process.env.timeZone);
    const ici = {
        temp: json_tp.feeds[0].field2,
        date: moment.toLocaleString('fr-FR', {
            timeZone: 'Europe/Paris',
            weekday: 'long',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric'})
    };
    console.log(ici);
    console.log(moment.toString());
    const result = {
        weather: json,
        ici: ici
    };
    res.json(result);
});

app.post('/api', (req,res)=>{
    let data = req.body;
    const timestamp = Date.now();
    data.timestamp = timestamp;
    Database.insert(data);
    const ret = {
        status: "success",
        timestamp: data.timestamp,
        latitude: data.lat,
        longitude: data.lng
    };
    console.log("Requête reçue !")
    console.log(ret);
    res.json(ret);
    //console.log(data);
});


app.listen(3000, ()=> {
   console.log('Serveur en écoute sur le port 3000');
});


// prochain : https://www.youtube.com/watch?v=1mnpn6q25FI
