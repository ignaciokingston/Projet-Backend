//import express-list-endpoints
const listEndpoints = require('express-list-endpoints');

const express = require ('express');

const mongoose = require('mongoose');

const app = express ();

//import dotenv - pour utiliser variables d'environnement
require('dotenv').config();

app.use((req, res, next) => {
    //pour accéder à l'API depuis n'importe quel origine
    res.setHeader('Access-Control-Allow-Origin', '*');
    //pour ajouter les headers aux requêtes envoyées vers l'API
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    //pour envoyer des requêtes avec les méthodes GET, POST, etc.
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

//pour extraire le corps JSON
app.use(express.json());

//connexion mongoose 
mongoose.connect(process.env.MONGO_URI, { 
    useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));


//enregistrement du router book
const bookRoutes = require ('./routes/book');
app.use('/api/books', bookRoutes);

//enregistrement du router user
const userRoutes = require ('./routes/user');
app.use('/api/auth', userRoutes);

//pour accéder au path du serveur
const path = require ('path');
//pour indiquer à express de gérer la ressource images de manière statique
app.use('/images', express.static(path.join(__dirname, 'images')));



//pour voir sur la console les endpoints
console.log(listEndpoints(app))

module.exports = app;
