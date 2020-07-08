var express = require('express');
const rutasProtegidas = express.Router();

rutasProtegidas.use((req, res, next) => {
	const jwt = res.app.get("jwt");

	const token = req.headers['access-token'];
	if (token) {
		jwt.verify(token, res.app.get('jwtKey'), (err, decoded) => {
			if (err) {
				return res.status(401).send({ mensaje: 'Token inválida' });
			} else {
				req.decoded = decoded;
				next();
			}
		});
	} else {
		res.status(401).send({ mensaje: 'Token no proveída.' });
	}
});

module.exports = rutasProtegidas;