var express = require('express');
var router = express.Router();

var uuid = require('node-uuid');
var db = require('../config/db.js');
var DockerEventsHub = require('../utils/docker_events_hub');

const listeners = db.get('listeners');

router.get('/', function(req, res) {
  res.json(listeners.value());
});

router.get('/:id', function(req, res) {
  const listener = listeners.find({
    id: req.params.id
  }).value();
  if (listener)
    res.json(listener);
  else
    res.sendStatus(404);
});

router.post('/', (req, res) => {
  var listener_attributes = listener_params(req.body);
  if (validateListener(listener_attributes)) {
    var query = listeners.find({
      app_name: req.body.app_name,
      hook_name: req.body.hook_name
    });

    if (query.size().value() > 0) {
      if (!isListenerEquals(query.value(), listener_attributes)) {
        var listener = query.assign(listener_attributes).value();
        DockerEventsHub.unregisterListener(listener.id);
        DockerEventsHub.registerListener(listener);
      }
      res.status(200).json(listener);
    } else {
      listener_attributes.id = uuid();
      var listener = listeners.push(listener_attributes).last().value();
      DockerEventsHub.registerListener(listener);
      res.status(201).json(listener);
    }

  } else {
    console.log('bad parameters');
    console.log(listener_attributes);
    res.sendStatus(422);
  }
});

router.delete('/:id', (req, res) => {
  var listener_id = req.params.id;
  listeners.remove({
    id: listener_id
  }).value();

  DockerEventsHub.registerListener(listener_id);

  res.sendStatus(204)
})

function validateListener(listener) {
  if (!listener.hook_url) return false;
  if (!listener.hook_method) return false;
  if (!listener.app_name) return false;
  if (!listener.hook_name) return false;
  if (!(listener.hook_headers instanceof Object)) return false;
  var filters = listener.filters;
  if (!(filters instanceof Object)) return false;
  var keys = Object.keys(filters);
  var allowedKeys = ['container', 'event', 'image', 'label', 'type', 'volume', 'network', 'daemon'];
  for (var i = 0; i < keys.length; i++) {
    if (allowedKeys.indexOf(keys[i]) < 0) return false;
  }
  return true;
}

function isListenerEquals(r1, r2) {
  attributes = ['hook_url', 'hook_method', 'app_name', 'hook_name']
  for (var i = 0; i < attributes.length; i++) {
    key = attributes[i];
    if (r1[key] !== r2[key]) return false;
  }
  if (JSON.stringify(r1.hook_headers) !== JSON.stringify(r2.hook_headers)) return false;
  if (JSON.stringify(r1.filters) !== JSON.stringify(r2.filters)) return false;
  return true;
}

function listener_params(params) {
  return {
    hook_url: params.hook_url,
    hook_method: params.hook_method || 'POST',
    hook_name: params.hook_name,
    hook_headers: params.hook_headers || {},
    app_name: params.app_name,
    filters: params.filters || {}
  };
}

module.exports = router;
