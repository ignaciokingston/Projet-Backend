//import modèle mongoose
const Book = require ('../models/book');

//import package fs - file system- pour gérer modifications (supprimer) des fichiers
const fs = require('fs');

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
    const { rating } = req.body;
    //création objet qui contient userId et la note
    const userRating = { userId, grade: rating }; 
    //cherche le book par son id +                  mise à jour de la note +     retourner livre mise à jour     
    Book.findByIdAndUpdate({_id: req.params.id}, { $push: { ratings : userRating }}, {new:true})
    .then((book) => {
        if (!book) {
            return res.status(404).json({ message: 'Livre non trouve'});
        }
    //Mise à jour de la note moyenne
    const sum = book.ratings.reduce((total, rating) => total + rating.grade, 0);
    book.averageRating = sum / book.ratings.length;

    //Sauvegarde de changements
    book.save()
    .then(updatedBook => {res.json(updatedBook)})  //retourne le livre mise à jour
    .catch ((error) => res.status(500).json({ error }));
    });
};

