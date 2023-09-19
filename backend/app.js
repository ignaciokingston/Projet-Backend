const express = require ('express');

const mongoose = require('mongoose');

const app = express ();

//pour extraire le corps JSON
app.use(express.json());

//import modèle mongoose
const Book = require ('/models/book')

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

//logique route POST
app.post('/api/book', (req, res, next)=> {
    delete req.body._id
    const book = new Book({
        ...req.body
    });
    //méthode save pour enregistrer dans la base de données
    book.save()
    .then (() => res.status(201).json ({message: 'Livre enregistré !'}))
    .catch(error => res.status(400).json({ error }))
    });

//logique route GET x 1 élément en particulier
app.get('/api/book/:id', (req, res, next) =>{
    Book.findOne({_id: req.params.id})
    .then(book=> res.status(200).json(book))
    .catch(error => res.status (404).json({ error }));
});

//logique route PUT x modifier un élément
app.put('/api/book/:id', (req, res, next) =>{
    Book.updateOne({_id: req.params.id},{...req.body,_id: req.params.id})
    .then(book=> res.status(200).json({message: 'Livre modifié !'}))
    .catch(error => res.status (404).json({ error }));
});

//logique route DELETE x supprimer un élément
app.delete ('/api/book/:id', (req, res, next) =>{
    Book.deleteOne({_id: req.params.id})
    .then(book=> res.status(200).json({message: 'Livre supprimé !'}))
    .catch(error => res.status (404).json({ error }));
});


app.use('/api/book', (req, res) => {
    const book = [
        {
            usedId: '',
            title: '',
            author: '',
            imageUrl: '',
            year: 0,
            genre: '',
            ratings: [
                {
                    userId: '',
                    grade: 0,
                }
            ],
            averageRating: 0
        },
    ];
    res.status(200).json(book);
});

app.use('/api/book', (req, res, next) =>{
    //méthode find pour récuperer les livres
    Book.find()
    .then(books => res.status(200).json(books))
    .catch(error => res.status(400).json({ error }));
});

module.exports = app;
