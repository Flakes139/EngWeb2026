var express = require('express');
var router = express.Router();
var axios = require('axios');

router.get('/', function(req, res, next) {
  axios.get("http://localhost:3000/filmes?_sort=id")
    .then(resp => {
      var filmes = resp.data
      res.render('index', { filmes: filmes })
    })
});

router.get('/filmes/:id', function(req, res, next) {
  axios.get("http://localhost:3000/filmes/" + req.params.id)
    .then(resp => {
      var filme = resp.data 
      res.render('filme', { filme: filme })
    })
});

router.get('/atores', function(req, res, next) {
  axios.get("http://localhost:3000/atores?_sort=id")
    .then(resp => {
      var atores = resp.data 
      res.render('atores', { atores: atores })
    })
});

router.get('/atores/:id', function(req, res, next) {
  axios.get("http://localhost:3000/atores/" + req.params.id)
    .then(resp => {
      var ator = resp.data 
      res.render('ator', { ator: ator })
    })
});

router.get('/generos', function(req, res, next) {
  axios.get("http://localhost:3000/generos?_sort=id")
    .then(resp => {
      var generos = resp.data 
      res.render('generos', { generos: generos })
    })
});

router.get('/generos/:id', function(req, res, next) {
  axios.get("http://localhost:3000/generos/" + req.params.id)
    .then(resp => {
      var genero = resp.data 
      res.render('genero', { genero: genero })
    })
});



module.exports = router;