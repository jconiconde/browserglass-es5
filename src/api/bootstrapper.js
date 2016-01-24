var link = require('../api/linkApi');
var user = require('../api/userApi');
var bsync = require('../blocks/browserSync.server.js');
module.exports = function(app, server, sio) {
	link(app);
	user(app);
	bsync(sio);
};