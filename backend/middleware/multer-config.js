//import multer
const multer = require('multer');

const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png' : 'png'
};

//méthode pour configurer le chemin et nom du fichier 
const storage = multer.diskStorage({
    //fonction pour sauvegarder les fichiers dans le dossier images
    destination: (req, file, callback) => {
        callback(null, 'images');
    },
    //fonction pour nommer le fichier avec le nom d'origin 
    filename: (req, file, callback) => {
        //+ ajouter tiret du bas entre les spaces vides
        const name = file.originalname.split('').join('_');
        const extension = MIME_TYPES[file.mimetype];
        // + ajouter timestamp + const mime pour définir extension fichier appropiée
        callback(null, name + Date.now() + '.' + extension);
    }
});

module.exports = multer({storage: storage}).single('image');
//méthode single pour créer un middlware qui capture les fichiers d'un certain type (passé en arg)
// et les enregistre au système de fichiers du serveur à l'aide du storage configuré