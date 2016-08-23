var express = require('express');

var bodyParser = require('body-parser')

var app = express();
var listenerResource = require('./resources/listener');
var hookTester = require('./resources/hook_tester');

var DockerEventsHub = require('./docker_events_hub');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/listeners', listenerResource);
app.use('/hook_tester', hookTester);

var port = process.env['PORT'] || 3000

app.listen(port, function () {
  console.log(`Example app listening on port ${port}!`);
});

DockerEventsHub.init();
