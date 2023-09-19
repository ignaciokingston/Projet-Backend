//import bcrypt
const bcrypt = require('bcrypt');

//import modèle User
const User = require('../models/user');

//import token
const jwt = require('jsonwebtoken');


exports.signup = (req, res, next) => {
bcrypt.hash(req.body.password, 10)
.then(hash =>{
    const user = new User({
        email: req.body.email,
        password: hash
    });
    user.save()
    .then(() => resizeTo.status(201).json ({ message: 'Utilisateur crée !'}))
    .catch(error => resizeTo.status(400).json({ error}));
    })
    .catch(error => res.status(500).json({ error }));    
};

exports.login = (req, res, next) => {
    User.findOne({email: req.body.email})
    .then(user =>{
        if(!user){
            return res.status(401).json({ message: 'Paire login/mot de passe incorrecte'});
        }
        bcrypt.compare(req.body.password)
        .then(valid => {
            if(!valid){
                return res.status(401).json({ message: 'Paire login/mot de passe incorrecte'});
            }
            res.status(200).json({
                userId: user._id,
                token: jwt.sign(
                    { usedId: user._id},
                    'RANDOM_TOKEN_SECRET',
                    { expiresIn:'24h'}
                )
            });
        })
        .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};
