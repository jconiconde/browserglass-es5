var express = require('express');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var args = require('yargs').argv;
var app = express();
var fs = require('fs');
var bootApi = require('./api/bootstrapper');
var mongoose = require('mongoose');
var http = require('http');
var server = null;
var cluster = require('cluster'); // Only required if you want the worker id
var sticky = require('sticky-session');
var yargs = require('yargs').argv;
mongoose.connect('mongodb://localhost/browserglass');


app.engine('.hbs', exphbs({
	layoutsDir: 'src/views/layouts',
	defaultLayout:'main',
	extname: '.hbs',
}));
app.set('view engine', '.hbs');
app.set('views', 'src/views/');
app.set('port', process.env.PORT || 8007);
app.use(express.static('./dist'));
app.use(bodyParser.json());

// app.get('/', function(req, res) {
// 	res.writeHead(200, { 'Content-Type': 'text/html' });
// 	global.bghost = req.headers.host;
// 	console.log('test');
// 	res.end(fs.readFileSync('./dist/index.html'));
// });
app.get('/', function(req, res) {
	global.bghost = req.headers.host;
	res.render('index');
});
server = http.createServer(app);

// if (!sticky.listen(server, app.get('port'))) {
//   // Master code
//   server.once('listening', function() {
//   	console.log('Express server listening on port ' + app.get('port'));
//   	console.log('env = ' + app.get('env') +
//   		'\n__dirname = ' + __dirname +
//   		'\nprocess.cwd = ' + process.cwd());
//   });
// } else {
//   // Worker code
// }

server.listen(app.get('port'), function (err) {
	if (err) {
		console.log(err);
	}
	console.log('Express server listening on port ' + app.get('port'));
	console.log('env = ' + app.get('env') +
		'\n__dirname = ' + __dirname +
		'\nprocess.cwd = ' + process.cwd());

  console.log('URL = http://' + require('ip').address() + ':' + app.get('port'));

});
var sio = require('socket.io').listen(server);



bootApi(app, server, sio);

// //404 catch-all handler (middleware)
// app.use(function(req, res, next){
// 	res.status(404);
// 	res.render('404');
// });

// // 500 error handler (middleware)
// app.use(function(err, req, res, next){
// 	console.error(err.stack);
// 	res.status(500);
// 	res.render('500');
// });
app.use(logErrors);
app.use(clientErrorHandler);
app.use(errorHandler);

function logErrors(err, req, res, next) {
  console.error(err.stack);
  next(err);
}
function clientErrorHandler(err, req, res, next) {
	if (req.xhr) {
		res.status(500).send({ error: 'Something failed!' });
	} else {
		next(err);
	}
}
function errorHandler(err, req, res, next) {
  res.status(500);
  res.render('error', { error: err });
}