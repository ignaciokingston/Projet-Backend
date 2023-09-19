const express = require ('express');

const router = express.Router();

const bookCtrl = require('../controllers/book');

//routage grâce au méthode router
router.get('/', bookCtrl.getAllBook); //tous les livres
router.post('/', bookCtrl.createBook);
router.get('/:id', bookCtrl.getOneBook);
router.put('/:id', bookCtrl.modifyBook);
router.delete('/:id', bookCtrl.deleteBook);

module.exports = router;