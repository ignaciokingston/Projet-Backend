//import webtoken
const jwt = require ('jsonwebtoken')

module.exports= (req, res, next) => {
    try {
        //extraction du token du header Authorization + split pour tout récuperer après le space dans le header
        const token = req.headers.authorization.split('')[1];
        //fonction verify pour décoder le token
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
        //extraction du id
        const usedId =decodedToken.userId;
        //ajout dans la rêquete
        req.auth = {
            usedId: usedId
        };
        next();
    } catch(error) {
        res.status(401).json({ error });
    }
};