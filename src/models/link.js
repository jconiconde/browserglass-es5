var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var UserModel = require('./user');
var browserSchema = new Schema({
	open : Boolean,
	name : String
});

var linkSchema = new Schema({
	title : String,
	description : String,
	browser : [{type: Schema.Types.Object, ref: 'browserSchema'}],
	url : String,
	online : {type : Boolean, default : false},
	owner : Schema.Types.ObjectId,
	createdDate : {type : Date,   default: Date.now},
	modifiedDate : {type : Date},
	expiry : {type : Number, default : 15},
	tunnel : {type : Schema.Types.Mixed, default: false}
});

var Link = module.exports = mongoose.model('Link', linkSchema);

module.exports.findById = Link.findById.bind(Link);

Link.getLinksByUser = function(id, cb) {
	UserModel.findOne({_id : id },{
		'links._id' : 1,
		_id : 0
	}, function(err, userDoc) {
		Link.find({_id : { $in : userDoc.links}}, cb);
	});
};

Link.createLink = function(link, cb) {
	Link.create(link, function(err, createdDoc) {
		if (err) {
			throw err;
		}
		UserModel.findOne({_id : link.owner }, function(userErr, userDoc) {
			userDoc.links.push({
				_id : createdDoc._id,
				owner: true
			});
			userDoc.save(cb);
		});
	});
};

module.exports.update = function(link, cb, options) {
	link.modifiedDate = new Date();
	Link.findOneAndUpdate({_id : link.id}, link, options, cb);
};

module.exports.delete = function(id, cb) {
	Link.remove({_id : id}, cb);
};

