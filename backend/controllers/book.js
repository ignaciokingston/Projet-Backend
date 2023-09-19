//import modèle mongoose
const Book = require ('../models/book');

//logique route POST
exports.createBook = (req, res, next)=> {
    //transformation d'un objet string à un objet JS exploitable
    const bookObject = JSON.parse(req.body.book);
    //par messure de sécurité; on les remplacent par le userId du token par middleware de auth
    delete bookObject._id;
    delete bookObject._userId;
    const book= new Book ({
        usedId: req.auth.userId,
        title: req.params.title,
        author: req.params.author,
        //pour résoudre l'URL complète de l'image (ATT méthode GET !)
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        year: req.params.year,
        genre: req.params.genre,
        ratings: [
            {
                userId: req.params.ratings.userId,
                grade: req.params.ratings.grade,
            }
        ],
        averageRating: req.params.averageRating
        });
        //méthode save pour enregistrer dans la base de données
        book.save()
        .then (() => res.status(201).json ({message: 'Livre enregistré !'}))
        .catch(error => res.status(400).json({ error }))
};

//logique route GET x 1 élément en particulier
exports.getOneBook = (req, res, next) =>{
    Book.findOne({_id: req.params.id})
    .then(book=> res.status(200).json(book))
    .catch(error => res.status (404).json({ error }));
};

//logique route PUT x modifier un élément
exports.modifyBook = (req, res, next) =>{
    //pour vérifier s'il y a un fichier
    const bookObject= req.file ? {
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body};

    //par sécurité on élimine le userId - comme route POST
    delete bookObject._userId;
    Book.findOne({_id: req.params.id})
        .then((book) => {
            if (book.userId != req.auth.userId) {
                res.status(401).json({message: 'Not authorized'});
            } else {
                Book.updateOne({_id: req.params.id},{...req.body,_id: req.params.id})
                .then(book=> res.status(200).json({message: 'Livre modifié !'}))
                .catch(error => res.status (404).json({ error }));
            }
        })
        .catch((error) =>{
            res.status(400).json({error});
        });
};

//logique route DELETE x supprimer un élément
exports.deleteBook = (req, res, next) =>{
    Book.deleteOne({_id: req.params.id})
    .then(book=> res.status(200).json({message: 'Livre supprimé !'}))
    .catch(error => res.status (404).json({ error }));
};

//logique route GET x montrer les livres
exports.getAllBook = (req, res, next) =>{
    //méthode find pour récuperer les livres
    Book.find()
    .then(books => res.status(200).json(books))
    .catch(error => res.status(400).json({ error }));
};