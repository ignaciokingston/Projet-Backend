//import modèle mongoose
const Book = require ('../models/book');

//import package fs - file system- pour gérer modifications (supprimer) des fichiers
const fs = require('fs');

//import package sharp - por optimiser les images
const sharp = require ('sharp');

//fonction POST - créer un livre
exports.createBook = async (req, res, next)=> {
    //transformation d'un objet string à un objet JS exploitable
    const bookObject = JSON.parse(req.body.book);
    //par messure de sécurité; on les remplacent par le userId du token par middleware de auth
    delete bookObject._id;
    delete bookObject._userId;

    const book= new Book({
        ...bookObject,
        userId: req.auth.userId,
        //pour résoudre l'URL complète de l'image (ATT méthode GET !)
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });

    console.log('Before Sharp:', req.file.filename);


        console.log('After Sharp:', req.file.filename);

        //méthode save pour enregistrer dans la base de données
        book.save()
        .then (() => {
                    res.status(201).json({ message: 'Livre enregistré !' });
            })
        .catch(error => {
            res.status(400).json({ error });
        }); 
    };  



//fonction GET x 1 élément en particulier
exports.getOneBook = (req, res, next) =>{
    Book.findOne({_id: req.params.id})
    .then((book)=> {res.status(200).json(book);
    })
    .catch((error) => {res.status (404).json({ error });
    });
};

//fonction PUT x modifier un élément
exports.modifyBook = (req, res, next) =>{
    //pour vérifier s'il y a un fichier
    const bookObject= req.file ? {
        //transforme objet stringified en objet JS exploitable
        ...JSON.parse(req.body.book),
        //comme dans la route POST - construire l'URL
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body};

    //par sécurité on élimine le userId - comme route POST
    delete bookObject._userId;
    Book.findOne({_id: req.params.id})
        .then((book) => {
            if (book.userId != req.auth.userId) {
                res.status(401).json({message: 'Not authorized'});
            } else {
                Book.updateOne({_id: req.params.id}, {...bookObject,_id: req.params.id})
                .then(book=> res.status(200).json({message: 'Livre modifié !'}))
                .catch(error => res.status (404).json({ error }));
            }
        })
        .catch((error) =>{
            res.status(400).json({error});
        });
};

//fonction DELETE x supprimer un élément
exports.deleteBook = (req, res, next) =>{
    //pour vérifier le userId
    Book.findOne({ _id: req.params.id})
    .then(book => {
        if (book.userId != req.auth.userId) {
            res.status(401).json({message:'Not authorized'});
        } else {
            //l'image contient un segment images dans l'URL
            const filename = book.imageUrl.split('/images/')[1];
            //fonction unlink du package fs pour supprimer le fichier
            fs.unlink(`images/${filename}`, () => {
                Book.deleteOne ({_id: req.params.id})
                .then(() => { res.status(200).json({ message: 'Livre supprimé !' })})
                .catch(error => res.status(401).json({ error }));
            });
        }
    }) 
    .catch( error => {
        res.status (500).json({ error });
    });
};

//fonction GET x montrer les livres
exports.getAllBooks = (req, res, next) =>{
    //méthode find pour récuperer les livres
    Book.find()
    .then((books) => {res.status(200).json(books);
    })
    .catch((error) => {res.status(400).json({ error });
    });
};

//fonction GET x montrer les meilleurs livres
exports.getBestBooks = async (req, res, next) => {
    try {
        const bestBooks = await Book.find({})
            .sort({ averageRating: -1 }) //pour ranger en ordre descendant
            .limit(3); //limitation max de 3 livres

        res.status(200).json(bestBooks);
    } catch (error) {
        res.status(500).json({ error: "Erreur au moment de montrer les meilleurs livres"})
    }
};

//fonction POST - rating
exports.ratingBook = (req, res, next) => {
    //Extraction des données de la rêquete
    const userId = req.auth.userId;
    const userRating = req.body.rating;
    //cherche le book par son id
    Book.findByIdAndUpdate({_id: req.params.id})
    .then(book => {

        console.log('ID du livre dans req.params:', req.params.id);

        if(book.ratings.some((r) => r.userId === userId)) {
            return res.status(400).json({ error: 'Vous avez déjà qualifié ce livre'});
        }

        console.log('Livre avant de sauvegarder:', book);

        //Ajout la note du livre
        book.ratings.push({ userId, userRating});
        //Mise à jour de la note moyenne
        book.averageRating = calculateAverageRating(book.ratings);

        console.log('Livre après mise à jour de la note moyenne:', book);

        //Sauvegarde de changements
        return book.save()
        .then(book => {res.json(book)})
        .then(()=> {
        res.status(201).json({ message: 'Note ajoutée correctement !', book});
        }) 
    })

    .catch ((error) => {
    res.status(500).json({ error: 'Erreur au moment d\'ajouter la note !'});
    });
};


//fonction pour calculer la note moyenne
function calculateAverageRating(ratings) {
    //pour verifier s'il n y a pas de notes
    if(ratings.length === 0) return 0;
    //utilisation du méthode reduce pour faire une somme de toutes les notes
    const sum = ratings.reduce((total, rating) => total + rating.rating, 0);
    //pour calculer la moyenne - la somme divisée par la quantité de notes faites
    return sum / ratings.length;
};
