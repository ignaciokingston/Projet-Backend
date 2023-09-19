const express = require ('express');

const router = express.Router();

//import middleware de authentification
const auth = require('../middleware/auth');

//import middleware multer-config
const multer = require('..middleware/multer-config');

const bookCtrl = require('../controllers/book');

//routage grâce au méthode router
router.get('/', auth, bookCtrl.getAllBook); //tous les livres
router.post('/', auth, multer, bookCtrl.createBook); //ajout multer après auth par sécurité
router.get('/:id', auth, bookCtrl.getOneBook);
router.put('/:id', auth, bookCtrl.modifyBook);
router.delete('/:id', auth, bookCtrl.deleteBook);

module.exports = router;