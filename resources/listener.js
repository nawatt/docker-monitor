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
  var listener = listeners.find({ app_name: req.body.app_name, hook_name: req.body.hook_name}).value();
  if (listener) {
    res.status(200).json(listener);
  } else {
    var listener_attributes = listener_params(req.body);
    listener_attributes.id = uuid();
    listener = listeners.push(listener_attributes).last().value();
    DockerEventsHub.registerListener(listener);
    res.status(201).json(listener);
  }
});

router.delete('/:id', (req, res) => {
  var listener_id = req.params.id;
  listeners.remove({ id: listener_id }).value();

  DockerEventsHub.registerListener(listener_id);

  res.sendStatus(204)
})

function listener_params(params) {
  return {
    hook_url: params.hook_url,
    hook_method: params.hook_method,
    hook_name: params.hook_name,
    hook_headers: params.hook_headers,
    app_name: params.app_name,
    filters: params.filters
  };
}

module.exports = router;
