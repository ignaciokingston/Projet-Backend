const express = require ('express');

const app = express ();

app.use((req, res) => {
    res.json({message: 'Votre requête blabla'});
});

module.exports = app;