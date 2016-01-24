var addr = location.protocol + '//' + location.host + '/';

module.exports = {
	location : {
		hostname : 'http://' + require('ip').address() + ':' +
		 (process.env.PORT || 8007)  +'/',

	},
	dataUrl : addr,

	socketHost : addr
};