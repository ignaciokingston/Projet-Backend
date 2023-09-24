const express = require ('express');

const router = express.Router();

//import middleware de authentification
const auth = require('../middleware/auth');

//import middleware multer-config
const multer = require('../middleware/multer-config');

const bookCtrl = require('../controllers/book');

//routage grâce au méthode router
router.get('/', bookCtrl.getAllBook); //tous les livres (pas besoin de auth)
router.post('/', auth, multer, bookCtrl.createBook); //ajout multer après auth par sécurité
router.get('/:id', bookCtrl.getOneBook); //un livre (pas besoin de auth)
router.put('/:id', auth, multer, bookCtrl.modifyBook);
router.delete('/:id', auth, bookCtrl.deleteBook);

module.exports = router;