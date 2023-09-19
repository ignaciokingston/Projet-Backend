const express = require ('express');

const router = express.Router();

//import middleware de authentification
const auth = require('../middleware/auth');

const bookCtrl = require('../controllers/book');

//routage grâce au méthode router
router.get('/', auth, bookCtrl.getAllBook); //tous les livres
router.post('/', auth, bookCtrl.createBook);
router.get('/:id', auth, bookCtrl.getOneBook);
router.put('/:id', auth, bookCtrl.modifyBook);
router.delete('/:id', auth, bookCtrl.deleteBook);

module.exports = router;