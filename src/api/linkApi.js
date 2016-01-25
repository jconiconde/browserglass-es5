var linkModel = require('../models/link');
var apipath = '/api/links/';

module.exports = function(app) {
	app.get(apipath, function(req, res){
		linkModel.find(function(err, doc) {
			if(err){
				res.send(err);
			}
			res.json(doc);
		});
	});

	app.get(apipath + ':id', function(req, res){
		linkModel.getLinksByUser(req.params.id,
		function(err, doc) {
			if(err){
				res.send(err);
			}
			res.json(doc);
		});
	});

	// app.get(apipath + ':id', function(req, res){
	// 	linkModel.findById(req.params.id, function(err, doc) {
	// 		if(err){
	// 			res.send(err);
	// 		}
	// 		res.json(doc);
	// 	});
	// });
	app.post(apipath, function(req, res){
		linkModel.createLink(req.body, function(err, doc) {
			if(err){
				res.send(err);
			}
			res.json(doc);
		});
	});

	app.put(apipath + ':id', function(req, res){
		var prm = req.body.options
			? req.body.params || req.body
			: req.body;
		prm.id = req.params.id;

		linkModel.update(prm, function(err, doc) {
			if(err){
				res.status('500');
				res.send(err);
			}
			res.json(doc);
		});

	});

	app.delete(apipath + ':id/:userid', function(req, res){
		linkModel.delete(req.params.id, req.params.userid, function(err, doc) {
			if(err){
				res.send(err);
			}
			res.json(doc);
		});
	});
};

