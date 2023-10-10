//import sharp
const sharp = require('sharp');

const optimizeImageSize = async (req, res, next) => {
    try {
        if(req.file) {
            await sharp(req.file.path)
                .resize({height: 500})  //changement de taille
                .webp({quality: 80})    //changement qualité a webp
                .toFile(req.file.path.replace(/\.jpeg|\.jpg|\.png/g, "_") + ".webp") 

        }
        next()
    } catch( err) {
        res.status(500).json({ err })
    }
}

module.exports = optimizeImageSize;