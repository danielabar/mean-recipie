mean-recipie
============

An example of setting up a project using the MEAN (link needed) stack.

This project is inspired by a presentation at the [Toronto Angular Meetup](http://www.meetup.com/AngularJS-Toronto/) on scaffolding applications for the MEAN stack.

The idea is to use generators rather than seeds, then customize according to your needs. Watch the presentation [here](http://www.youtube.com/watch?v=w1mJuX-vA0o).

For this project, the following generators are used:

1. [express](https://github.com/visionmedia/express)
When installed globally, express can be used at the command line to scaffold an express application.
This is the server side of the application. Most of the generated directories and files are moved to the ```server``` directory.

2. [Yeoman Angular Generator](https://github.com/yeoman/generator-angular)
This is the client side of the application using Angular and Bower for dependency management. 
Most of the generated directories and files are moved to the ```client``` directory.

Then customizations are applied to use express together with Angular. 
Also configuration is modified to make everything work from within ```server``` and ```client``` folders. 
This is required because both generators assume everything will be in the project root.

To start scaffolding, this assumes you already have installed
* node
* express (globally)
* bower
* grunt-cli
* yo
* generator-angular
* mongo

Optionally, also install ```nodemon```. This will watch any changes to node server files eliminating the need to restart the server every time files are modified.

## Scaffolding Express

* ```cd ~/projects```  (or wherever your projects directory is)
* ```mkdir myproject && cd myproject``` (whatever you want your project to be called)
* ```express -s```
* ```npm install```
* ```node app.js``` (should start server at port 3000, verify Express page is displayed in browser, then shut down server)
* ```rm -rf public views```
* ```rm routes/index.js routes/user.js```
* ```mkdir server```
* ```mv routes server```
* ```mv app.js server.js```

## Scaffolding Angular

* ```mv package.json package.json.express``` (because the yeoman generator will overwrite)
* ```yo angular``` (yes to all questions except sass)
* manually merge ```package.json.express``` contents into ```package.json```
	* ```"version": "0.0.1",```
	* ```"private": true,```
	* ```
		"scripts": {
    	"start": "node server.js",
    	"test": "grunt test"
  	}
	```

	* copy express dependency (jade can be left out) ``` "express": "3.4.2",```

* rm package.json.express
* edit ```server.js``` so static files are read from client app
	```
	app.use(express.static(path.join(__dirname, '/client/app')));
	```
	* remove routes and user from top var section
	* remove app.get lines (will be replacing this with custom api)
	* remove ```app.set('view engine', 'jade');```
	* remove ```app.use(app.router);```

* mkdir client
* ``` mv app client```
* ```mv .bowerrc client```
* ```mv bower.json client```
* ```mv karma-e2e.conf.js client```
* ```mv karma.conf.js client```
* ```mv test client```
* edit ```bower.json```, change version to 0.0.01 and add: ```"appPath": "app"```
* edit ```Gruntfile.js```, add ```client/``` in front of ```bower.json``` and ```karma.conf.js```
* add to ```files``` section of ```karma.conf.js```, just after angular.js

	```
	'app/bower_components/angular-cookies/angular-cookies.js',
 	'app/bower_components/angular-resource/angular-resource.js',
 	'app/bower_components/angular-sanitize/angular-sanitize.js',
 	```
 	
* from terminal window, cd to project root directory and run:
	* ```npm install```  (because generator fails to install local grunt)
	* ```npm install grunt-karma --save-dev```
	* ```grunt test```
	* ```nodemon server.js```

* Test app is working by pointing your browser to http://localhost:3000

## Configure Mongo Database
* ```mkdir dbinit && cd dbinit```
* ```touch widgets.json```
* edit widgets.json - make it a json array with some simple data
* ```mongoimport -d scafkata -c widgets --type json --jsonArray --drop widgets.json```
	* replace ```scafkata``` with whatever you want your database to be called
* cd ..
* ```npm install winston --save```
* ```npm install mongoose --save```
* ```cd server```
* ```mkdir lib && cd lib```
* ```touch log.js db.js```
* edit ```log.js``` so it looks like this:
	```
	var logger = require('winston');
	var fs = require('fs');
	var path = require('path');

	var logs_path = path.resolve(__dirname, "../logs");
	if(!fs.existsSync(logs_path)) {
		fs.mkdirSync(logs_path);
	}

	var logfile = __dirname + '/../logs/development.log';
	if (process.env.NODE_ENV == 'production') {
		logfile = __dirname + '/../logs/production.log';
	}

	logger.add(logger.transports.File, { filename: logfile });
	module.exports = logger;
	```

* edit ```db.js``` so it looks like this, replacing ```scafkata``` with your database name:
	```
	var mongoose = require('mongoose');
	var logger = require('./log');

	var mongoURL = 'mongodb://127.0.0.1/scafkata';
	mongoose.connect(mongoURL);

	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));
	db.once('open', function callback() {
		logger.info('mongoose connection is open');
	});

	var WidgetModel = mongoose.model('Widget', new mongoose.Schema({}, {strict: false}));
	```

* edit the top section of ```server.js``` to require db and log:
	```
	var logger = require('./server/lib/log');
	var db = require('./server/lib/db');
	var widget = require('./server/routes/WidgetAPI');
	```

* start the server and make sure you can still hit the app

## Implement a simple GET API
* ```cd ../routes```
*  ```touch WidgetAPI.js```
* edit WidgetAPI.js to look like this:
	```
	var mongoose = require('mongoose');
	var logger = require('../lib/log');
	var Widget = mongoose.model('Widget');

	exports.get = function(req, res) {
		Widget.find(function(err, data) {
			if (err) {
				logger.error(module + ' get all widget err: ' + err);
				res.send(err);
			} else {
				logger.info('data to be returned: ' + JSON.stringify(data));
				res.json(data);
			}
		});
	};
	```

* edit ```server.js```
	* top section add ```var widget = require('./server/routes/WidgetAPI');```
	* just before server is created add ```app.get('/widget', widget.get);```
* test the API in browser ```http://localhost:3000/widget```

## Upgrade Angular and add some useful utilities
* delete all the contents of ```client/app/bower_components```
* edit ```bower.json``` so it looks like this:

	```
	{
	  "name": "quicktest",
	  "version": "0.0.1",
	  "appPath": "app",
	  "dependencies": {
	    "angular": "1.2.1",
	    "json3": "~3.2.4",
	    "jquery": "~1.9.1",
	    "es5-shim": "~2.0.8",
	    "angular-resource": "1.2.1",
	    "angular-cookies": "1.2.1",
	    "angular-sanitize": "1.2.1",
	    "angular-route": "1.2.1",
	    "angular-animate": "1.2.1",
	    "angular-bootstrap": "0.6.0",
	    "underscore": "1.5.2",
	    "d3": "~3.3.11",
	    "d3-tip": "0.6.2"
	  },
	  "devDependencies": {
	    "angular-mocks": "1.2.1",
	    "angular-scenario": "1.2.1"
	  }
	}
	```
	
* ```cd client```
* ```bower install```

* modify the angular section of index.html so it looks like this:
	```
	<script src="bower_components/angular-route/angular-route.js"></script>
    <script src="bower_components/angular-resource/angular-resource.js"></script>
    <script src="bower_components/angular-cookies/angular-cookies.js"></script>
    <script src="bower_components/angular-sanitize/angular-sanitize.js"></script>
    <script src="bower_components/angular-animate/angular-animate.js"></script>
    <script src="bower_components/angular-bootstrap/ui-bootstrap-tpls.js"></script>
    <script src="bower_components/underscore/underscore.js"></script>
    <script src="bower_components/d3/d3.js"></script>
    <script src="bower_components/d3-tip/index.js"></script>
    ```

* ```cd client/app/scripts```
* ```mkdir lib && cd lib && touch underscore-module.js``` 
* edit underscore-module.js so it looks like this:
	```
	var underscore = angular.module('underscore', []);
	underscore.factory('_', function() {
	  return window._; // assumes underscore has already been loaded on the page
	});
	```

* modify ```client/app.js``` to add the module dependencies:
	```
	angular.module('scafkata', [
		'ngRoute',
		'ngCookies',
		'ngResource',
		'ngSanitize',
		'ngAnimate',
		'ui.bootstrap',
		'underscore'
	])
	```   

* edit index.html near where app.js is and add ```<script src="scripts/lib/underscore-module.js"></script>``` 

## Setup Bootstrap LESS Customization (2.3.2)
These instructions are based on [Using Twitter Bootstrap the right way](http://ollomedia.com/using-twitter-bootstrap-the-right-way/)
* ```cd ~/projects```
* ```git clone https://github.com/twbs/bootstrap```
* ```cd bootstrap```
* ```git tag -l```
	* Verify v2.3.2 is in the list of tags
* ```git checkout tags/v2.3.2```
* ```cd ../bunnyhill```
* ```npm install less-middleware --save```
* ```cd client/app```
* ```mkdir less```
* ```cd less```
* ```touch layout.less misc.less style.less theme.less typography.less```
* ```cd ..```
* ```mkdir bootstrap && cd bootstrap```
* ```cp ~/projects/bootstrap/less/*.less .```
* Edit ```style.less``` so it looks like this

	```
	@import "../bootstrap/bootstrap.less";
	@import "../bootstrap/responsive.less";
	 
	@import "layout.less"; 
	@import "theme.less";
	@import "typography.less";
	@import "misc.less";
	```

* Initialize ```layout.less`` with comment to indicate its for Layout Customization
* Initialize ```typography.less``` with comment to indicate its for Headings and Type Faces
* Initialize ```theme.less``` to indicate its for Colors and Buttons etc
* Initialize ```misc.less``` to indicate its for Mixins and Utility Classes
* Edit ```index.html``` remove reference to bootstrap.css and replace with ```<link rel="stylesheet" href="styles/style.css">```
* Delete bootstrap.css from project
* Edit ```server.js```
	* ```var lessMiddleware = require('less-middleware');``` 	
	* just before the static definition, add this section to configure the less middleware
	
		```
		app.use(lessMiddleware({
		    dest: __dirname + '/client/app/styles',
		    src: __dirname + '/client/app/less',
		    paths: [path.join(__dirname, 'bootstrap')],
		    prefix: '/styles',
		    compress: true
		}));
		```

## Configure LiveReload
* edit ```Gruntfile.js``` , `files` section of ```livereload```
	```
	files: [
	  './client/app/scripts/**/*.js',
      './client/app/index.html',
      './client/app/views/*.html',
      './client/app/styles/*.css',
      './client/app/sounds/*.mp3',
      './client/app/img/*.{png,jpg,jpeg,gif,webp,svg}'
    ]
    ```
 
 * from the command line, root of project dir, enter ```grunt watch``` 

## Add a nav bar
* ```cd client```
* ```yo angular:controller NavbarController```
* edit NavbarController so that controller name is ```NavbarCtrl```
* create a file client/app/views/navbar.html, edit to look something like:
	```
	<div class="navbar">
	  <div class="navbar-inner">
	    <a class="brand" href="/">Your Title</a>
	    <ul class="nav">
	      <li class="active"><a href="/">Home</a></li>
	      <li><a href="/">Menu Item 1</a></li>
	      <li><a href="/">Menu Item 2</a></li>
	      <li><a href="/">Menu Item 3</a></li>
	    </ul>
	  </div>
	</div>
	```

* Edit index.html around the main container section to look like this:
	```
	<div class="container">
		<div ng-controller="NavbarCtrl">
			<ng-include src="'views/navbar.html'"></ng-include>
		</div>
		<ng-view></ng-view>
	</div>
	```

## Add a route
* From your project root directory, ```cd client```
* ```yo angular:route menuitem1
* edit ```navbar.html``` such that Menu Item 1 looks like ```<a href="/#/menuitem1">My Scores</a>```
