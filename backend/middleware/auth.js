//import webtoken
const jwt = require ('jsonwebtoken')

module.exports= (req, res, next) => {
    try {
        //extraction du token du header Authorization + split pour tout récuperer après le space dans le header
        const token = req.headers.authorization.split(' ')[1];
        console.log('Token:', token);
        //fonction verify pour décoder le token
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
        console.log('Decoded Token:', decodedToken);
        //extraction du id
        const userId =decodedToken.userId;
        console.log('User ID:', userId);
        //ajout dans la rêquete
        req.auth = {
            userId: userId
        };
        next();
    } catch(error) {
        console.error('Error:', error);
        res.status(401).json({ error });
    }
};