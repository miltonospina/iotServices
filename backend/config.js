module.exports = {
	opcua: {
		endpoint: "opc.tcp://localhost:4863",
		puerto: 7878
	},
	db: {
		user: 'admin',
		password: 'admin',
		server: 'localhost\\wincc',
		database: 'labservices'
	},
	webServer: {
		apiVersion: "/api/v0",
		port:3000,
		jwtKey: "miclaveultrasecreta123*"
	},
	ioServer:{
		port: 3033
	}
}