const express = require ('express');

const router = express.Router();

//import middleware de authentification
const auth = require('../middleware/auth');

//import middleware multer-config
const multer = require('../middleware/multer-config');

//import middleware sharp-config
const sharp = require ('../middleware/sharp-config')

//import controllers book
const bookCtrl = require('../controllers/book');

//routage grâce au méthode router
router.get('/', bookCtrl.getAllBooks); //tous les livres (pas besoin de auth)
router.post('/', auth, multer, sharp, bookCtrl.createBook); //ajout multer après auth par sécurité + sharp pour optimiser l'image
router.get('/bestrating', bookCtrl.getBestBooks); // meilleurs livres
router.get('/:id', bookCtrl.getOneBook); //un livre (pas besoin de auth)
router.put('/:id', auth, multer, bookCtrl.modifyBook); // modifier un livre
router.delete('/:id', auth, bookCtrl.deleteBook); // supprimer un livre
router.post('/:id/rating', auth, bookCtrl.ratingBook); // notes des livres

module.exports = router;