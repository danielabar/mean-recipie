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
* ```mkdir myproject``` (whatever you want your project to be called)
* ```cd myproject```
* ```express -s```
* ```npm install```
* ```node app.js``` (should start server at port 3000, verify Express page is displayed in browser, then shut down server)
* ```rm -rf public```
* ```rm -rf views```
* ```mkdir server```
* ```mv routes server```
* ```mv app.js server.js```
* edit ```server.js```, change ```require('./routes``` to ```require('./server/routes```
* ```node server.js```
* Test app is working by pointing your browser to http://localhost:3000 (will be error about missing index because views were removed, that's ok, will soon be replaced with Angular views)


## Scaffolding Angular

* ```mv package.json package.json.express``` (because the yeoman generator will overwrite)
* ```yo angular``` (yes to all questions except sass)
* manually merge ```package.json.express``` contents into ```package.json```
	* update version to 0.0.1
	* optionally set private to true (to avoid accidentally publishing to npm)
	* add scripts start, changing app.js to server.js
	* copy express dependency (jade can be left out)

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
* ```mkdir dbinit```
* ```cd dbinit```
* ```touch widgets.json```
* edit widgets.json - make it a json array with some simple data
* ```cd dbinit```
* ```mongoimport -d scafkata -c widgets --type json --jsonArray --drop widgets.json```
	* replace ```scafkata``` with whatever you want your database to be called
* cd ..
* ```npm install winston --save```
* ```npm install mongoose --save```
* ```cd server```
* ```mkdir lib```
* ```cd lib```
* ```touch log.js```
* ```touch db.js```
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

* edit ```db.js``` so it looks like this:
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
* ```cd client```
* ```bower install angular#1.2.1 --save```
* ```bower install angular-route#1.2.1 --save```
* ```bower install angular-resource#1.2.1 --save```
* ```bower install angular-cookies#1.2.1 --save```
* ```bower install angular-sanitize#1.2.1 --save```
* ```bower install angular-animate#1.2.1 --save```
* ```bower install angular-mocks#1.2.1 --save-dev```
* ```bower install angular-scenario#1.2.1 --save-dev```
* ```bower install angular-bootstrap#0.6.0 --save```
* ```bower install underscore#1.5.2 --save```
* ```bower install d3 --save```
* ```bower install d3-tip#0.6.2 --save```
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

## Configure LiveReload

## Working with yo

Rather than running commands from the root of the project directory, cd to client. Then can run, for example:
 ```yo angular:factory Deck```

