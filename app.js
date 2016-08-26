global.node_env = process.env.NODE_ENV || 'development';

var express = require('express');

var bodyParser = require('body-parser')

var app = express();
var listenerResource = require('./resources/listener');


var DockerEventsHub = require('./docker_events_hub');



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use('/listeners', listenerResource);

DockerEventsHub.init();

module.exports = app;
