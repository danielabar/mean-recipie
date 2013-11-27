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

## Add database and logging dependencies

## Upgrade Angular

## Using Bower

## Configure LiveReload

## Working with yo

Rather than running commands from the root of the project directory, cd to client. Then can run, for example:
 ```yo angular:factory Deck```

