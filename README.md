# Browserglass

This is a web app that can be used for synchronized testing with different devices / platforms. It uses [Browsersync](https://www.browsersync.io/) & socket.io behind the scene. I hope you find it useful :)

*Note: This project is still under development and only works for some secured sites. I recommend to only use it internally (for testing perhaps :P ). I'm planning to migrate it to ES6 & Redux, and consolidate a lot of stuff with new features .* 

### Tech

* node.js - evented I/O for the backend
* Express - fast node.js network app framework [@tjholowaychuk]
* Gulp - the streaming build system
* ESLint 
* React
* React-Router
* Flux
* Material UI
* Babel
* Browsersync
* Nodemon
* Mongoose
* MongoDB
* REDIS
* Socket.io
* Browserify
* Sass

### Installation

Install Node.js
```
* on OSX use homebrew brew install node
* on Windows use chocolatey choco install nodejs
```

You need Gulp installed globally:
```sh
$ npm i -g gulp
```

```sh
$ git clone https://github.com/jconiconde/browserglass-es5.git
$ cd browserglass-es5
$ npm i
```

Install MongoDB

```sh
Please follow the instructions on https://www.mongodb.org/
```

Seed data
```sh
Please follow the instructions on https://github.com/toymachiner62/node-mongo-seeds
```

### Development Tasks

```sh
$ gulp serve-dev
```
* Start compiling, serving, and watching files
* Opens it in a browser and updates the browser with any files changes.
* Generates source map for JS & CSS


```sh
$ gulp js
```
```sh
$ gulp css
```
```sh
$ gulp fonts
```
```sh
$ gulp fonts
```
```sh
$ gulp eslint
```


### Troubleshooting

* If you have problem with port 8006 (With livereload feature) , please switch to port 8007 instead.
* Some npm modules should be installed globally i.e gulp, node-sass, etc..
