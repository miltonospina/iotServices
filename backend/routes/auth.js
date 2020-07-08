var express = require('express');
var router = express.Router();

router.post('/', function (req, res, next) {
    const jwt = res.app.get('jwt')
    if (req.body.usuario === "mfol" && req.body.contrasena === "holamundo") {
        const payload = {
            check: true,
            usuario: req.body.usuario
        };
        const token = jwt.sign(payload, res.app.get('jwtKey'), {
            expiresIn: 1440
        });
        res.json({
            mensaje: 'Autenticación correcta',
            token: token
        });
    } else {
        res.json({ mensaje: "Usuario o contraseña incorrectos" })
    }
});

module.exports = router;