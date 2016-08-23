var express = require('express');
var router = express.Router();

var uuid = require('node-uuid');
var db = require('../db.js');
var DockerEventsHub = require('../docker_events_hub');

const listeners = db.get('listeners');

router.get('/', function (req, res) {
  res.json(listeners.value());
});

router.get('/:id', function (req, res) {
  const listener = listeners.find({id: req.params.id}).value();
  if (listener)
    res.json(listener);
  else
    res.sendStatus(404);
});

router.post('/', (req, res) => {
  const listener = listeners.push({
    id: this.id,
    hook_url: req.body.hook_url,
    hook_method: req.body.hook_method,
    app_name: req.body.app_name,
    filters: req.body.filters
  }).last().value();

  DockerEventsHub.registerListener(listener);

  res.status(201).json(listener);
});

router.delete('/:id', (req, res) => {
  var listener_id = req.params.id;
  listeners.remove({ id: listener_id }).value();

  DockerEventsHub.registerListener(listener_id);

  res.sendStatus(204)
})

module.exports = router;
