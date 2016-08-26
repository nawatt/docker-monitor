global.node_env = process.env.NODE_ENV || 'development';

var express = require('express');
var bodyParser = require('body-parser')
var listenerResource = require('./resources/listener');
var DockerEventsHub = require('./utils/docker_events_hub');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use('/listeners', listenerResource);

DockerEventsHub.init();

module.exports = app;
