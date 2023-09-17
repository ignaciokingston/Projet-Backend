const express = require ('express');

const app = express ();

//pour extraire le corps JSON
app.use(express.json());

app.use((req, res, next) => {
    //pour accéder à l'API depuis n'importe quel origine
    res.setHeader('Access-Control-Allow-Origin', '*');
    //pour ajouter les headers aux requêtes envoyées vers l'API
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    //pour envoyer des requêtes avec les méthodes GET, POST, etc.
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

app.post('/api/book', (req, res, next)=> {
    console.log(req.body);
    res.status(201).json ({
        message: 'Objet créé'
    });
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

module.exports = app;
