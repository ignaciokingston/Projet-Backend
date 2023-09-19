const express = require ('express');

const mongoose = require('mongoose');

const app = express ();

//pour extraire le corps JSON
app.use(express.json());

//enregistrement du router
const bookRoutes = require ('./routes/book');
app.use('/api/book', bookRoutes);

//enregistrement du router 
const userRoutes =require('./router/user');
app.use('/api/auth', userRoutes);

//pour accéder au path du serveur
const path = require ('path');
//pour indiquer à express de gérer la ressource images de manière statique
app.use('/image', express.static(path.join(__dirname, 'images')));

mongoose.connect('mongodb+srv://ignaciokingston2:Coursdebackend7@cluster0.iqzqkbs.mongodb.net/?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use((req, res, next) => {
    //pour accéder à l'API depuis n'importe quel origine
    res.setHeader('Access-Control-Allow-Origin', '*');
    //pour ajouter les headers aux requêtes envoyées vers l'API
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    //pour envoyer des requêtes avec les méthodes GET, POST, etc.
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

module.exports = app;
