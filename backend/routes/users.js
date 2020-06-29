var express = require('express');
var router = express.Router();

/* GET users listing. */
router.post('/', function(req, res, next) {
  respuesta = req.body
  console.log(respuesta)
  res.send(respuesta);
});

module.exports = router;
