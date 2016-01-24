var gulp        = require('gulp'),
	browserSync = require('browser-sync').create(),
	reload = browserSync.reload,
	browserify = require('browserify'),
	reactify = require('reactify'),
	watchify = require('watchify'),
	source = require('vinyl-source-stream'),
	exorcist = require('exorcist'),
	gutil = require('gulp-util'),
	gulpif = require('gulp-if'),
	$ = require('gulp-load-plugins')({lazy: false}),
	oAssign = require('object-assign'),
	moment = require('moment'),
	path = require('path'),
    yargs = require('yargs').argv,

    // child process
    cp = require('child_process');


var config = require('./gulpconfig.js')();
var port = process.env.PORT || config.port ;

gulp.task('js', ['lint'], function() {
    watchify.args.debug = true;
	var opts = oAssign(config.browserify, {
		cache: {}, packageCache: {}
	}, watchify.args),
	b = watchify(browserify(opts));

	// #region Transforms
	b.transform(reactify);
    // for ES6 or ES 2015
    //b.transform(babelify);
	// #endregion
	config.browserify.excludedFiles.forEach(function(file){

        b.exclude(file);
	});

    //config.browserify.require.forEach(function (req) {
    //    b.require(req.file, {expose : req.expose});
    //});

	b.on('update', function() {
		bundle(b);
	});
	b.on('error', console.error.bind(console));
	return bundle(b);
	function bundle(bundler) {
		log('Compiling JS');
		return bundler.bundle()
        .on('error', function(err) {
            console.log(err.message);
            //throw err;
        })
		.pipe($.plumber())
		.pipe(exorcist(config.paths.jsMap))
		.pipe(source('bundle.js'))
		.pipe(gulp.dest(config.paths.dist + 'scripts'))
		.pipe(browserSync.stream({match: '**/*.js'}));
	}
});

gulp.task('fonts', function() {
    log('Copying fonts');
    return gulp
        .src(config.paths.fonts)
        .pipe(gulp.dest(config.paths.dist + 'fonts'));
});

gulp.task('html', function() {
	return gulp.src(config.paths.html)
	.pipe(gulp.dest(config.paths.dist))
	.pipe(browserSync.stream({match: '**/*.html'}));
});

gulp.task('sass', function() {
    log('Compiling SASS --> CSS');
    return gulp
        .src(config.paths.sass)
        .pipe($.plumber()) // exit gracefully if something fails after this
        .pipe($.sourcemaps.init({loadMaps : true, debug : true}))
        .pipe($.sass())
        .pipe($.autoprefixer({browsers: ['last 2 version', '> 5%']}))
        .pipe($.concat('bundle.css'))
        .pipe($.sourcemaps.write('./', {
            includeContent: false,
            sourceRoot: './src/styles'
        }))
        .pipe(gulp.dest(config.paths.dist + 'styles'))
        .pipe(browserSync.stream({
            match : '**/*.css'
        }));
});


gulp.task('lib-css', function() {
    log('Compiling  CSS');
    return gulp
        .src(config.paths.css)
        .pipe($.plumber()) // exit gracefully if something fails after this
        .pipe($.sourcemaps.init({loadMaps : true, debug : true}))
        .pipe($.concat('lib.bundle.css'))
        .pipe($.sourcemaps.write('./'))
        .pipe(gulp.dest(config.paths.dist + 'styles'))
        .pipe(reload({stream:true}));
});

gulp.task('lint', function() {
  return gulp.src(config.paths.js)
    .pipe($.eslint())
    .pipe($.eslint.format());
});

gulp.task('inject', ['sass', 'lib-css', 'js', 'html', 'fonts']);

gulp.task('serve-dev', ['inject'], function(cb) {
	serve(true, false, cb);
});

gulp.task('default', function() {
	for(var k in $) {
		if ($.hasOwnProperty(k)) { console.log(k); }
		
	}
});

function serve(isDev, specRunner, cb) {
    var ni = null;
    var started = false;
    if (yargs.debug) {
        ni = cp.exec('node-debug ' + __dirname + config.nodeServer.substr(1)
        //ni = cp.spawn('firefox',
        ,function(err) {
            console.log('node-debug error: \n' + err);
        });
        // ni.on('error', function(err) {
        //     console.log('shocks \n' + err);
        // })
        return;
    }

    return $.nodemon(config.nodemon({
    	isDev : isDev,
    	port : port
    }))
    .on('restart', function(ev) {
        log('*** nodemon restarted **** - ');
        log('files changed:\n' + ev);
        setTimeout(function() {
            browserSync.notify('reloading now ...');
            reload({stream : true});
        }, config.browserSync.browserReloadDelay);
    })
    .on('start', function () {
        log('*** nodemon started **** - ');
        startBrowserSync(isDev, specRunner);
        if (!started) {
            cb();
            started = true; 
        } 
    })
    .on('crash', function () {
        log('*** nodemon crashed: script crashed for some reason');
    })
    .on('exit', function () {
        log('*** nodemon exited cleanly');
    });
}

function startBrowserSync(isDev, specRunner) {
	if (browserSync.active) {
        return;
    }
    log('Starting BrowserSync on port ' + port);

	gulp.watch([config.paths.sass],
		 ['sass'])
           .on('change', changeEvent);

    browserSync.init(config.browserSync({port : yargs.debug ? port : config.port}));
}
function changeEvent(event) {
    var srcPattern = new RegExp('/.*(?=/' + config.source + ')/');
    log('File ' + event.path.replace(srcPattern, '') + ' ' + event.type);
}

function log(msg) {
    if (typeof(msg) === 'object') {
        for (var item in msg) {
            if (msg.hasOwnProperty(item)) {
                $.util.log($.util.colors.blue(msg[item]));
            }
        }
    } else {
        $.util.log($.util.colors.blue(msg));
    }
}
module.exports = gulp;