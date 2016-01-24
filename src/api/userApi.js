var userModel = require('../models/user');
var apipath = '/api/users/';

module.exports = function(app) {
	app.get(apipath, function(req, res) {
		userModel.find(function(err, doc) {
			if(err){
				res.send(err);
			}
			res.json(doc);
		});
	});

	app.get(apipath + 'login/:username', function(req, res){
		userModel.findOne({username : req.params.username},
		 function(err, doc) {
			if(err){
				res.send(err);
			}
			res.json(doc);
		});
	});
};