module.exports = function() {
	var src = './src/',
	dist = './dist/',
	config = {
		proxyPort: 8006,
		port : 8007,
		devBaseUrl: 'http://localhost',
		paths: {
			src : './src/',
			html: './src/*.html',
			js: './src/**/*.js',
			images: './src/images/*',
			css: [
				'node_modules/uikit/dist/css/uikit.css',
				'node_modules/uikit/dist/css/components/tooltip.css',
				'node_modules/toastr/build/toastr.css'
			],
			sass : src + 'styles/**/*.scss',
			fonts : [
				src + 'fonts/**/*.*',
				'node_modules/uikit/dist/fonts/*.*'
			],
			dist: dist,
			mainJs: './src/main.js',
			jsMap : dist + 'scripts/bundle.js.map'
		},
		nodeServer: './src/browserglass.js'
	};

	config.browserify = {
		entries : [config.paths.mainJs],
		excludedFiles : [
			'browserglass.js'
		],
		paths : config.paths.js,
		basedir : '.',
		debug: true
	};

	config.browserSync = function(args) {
		return {
			proxy : {
				target : require('ip').address() + ':' + args.port,
				ws : false
			},
	        port: config.proxyPort,
	        host : require('ip').address(),
	        open: 'external',
	        files : [
	        ],
	        ghostMode: {
	            clicks: true,
	            location: false,
	            forms: true,
	            scroll: true
	        },
	        injectChanges: true,
	        logFileChanges: true,
	        logLevel: 'debug',
	        logPrefix: 'Browser glass',
	        notify: true,
	        reloadDelay: 0, //1000,
	        watchOptions: {
	            ignoreInitial: true,
	            ignored: '*.js'
	        },
	        minify : false,
	        ui : false
		};
	};
	config.nodemon = function(args){
		return {
	        script: config.nodeServer,
	        delayTime: 1,
	        env: {
	            'PORT': args.port,
	            'NODE_ENV': args.isDev ? 'dev' : 'build'
	        },
	        ignoreRoot: ['./dist']
		};
    };

	return config;
};