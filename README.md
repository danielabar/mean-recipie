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

* ```express -s```
* ```npm install```
* ```mv public server```
* ```mv routes server```
* ```mv views server```
* ```mv app.js server.js```
* change require paths in ```server.js``` to start at ```./server``` directory
* ```node server.js```
* Test app is working by pointing your browser to http://localhost:3000

## Scaffolding Angular

* ```mv package.json package.json.express``` (because the yeoman generator will overwrite)
* ```yo angular``` (yes to all questions except sass)
* merge ```package.json.express``` contents into ```package.json```
* edit ```server.js``` so static files are read from client app
	```
	app.use(express.static(path.join(__dirname, '/client/app')));
	```
* ``` mv app client```
* ```mv .bowerrc client```
* ```mv bower.json client```
* ```mv karma-e2e.conf.js client```
* ```mv karma.conf.js client```
* ```mv test client```
* edit ```bower.json```, add: ```"appPath": "client/app"```
* edit ```Gruntfile.js```, add ```client``` in front of ```bower.json``` and ```karma.conf.js```
* add to ```karma.conf.js```
	```
	'app/bower_components/angular-cookies/angular-cookies.js',
 	'app/bower_components/angular-resource/angular-resource.js',
 	'app/bower_components/angular-sanitize/angular-sanitize.js',
 	```
 * ```grunt test```
 * Test app is working by pointing your browser to http://localhost:3000

