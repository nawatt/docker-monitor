var db = require('./db.js');
var request = require('request');
var DockerEventsEmitter = require('./utils/docker_events_emitter')
var Docker = require('dockerode');

var docker = new Docker();
var listeners = {};

DockerEventsHub = {
  unregisterListener: (listener_id) => {
    var listener = listeners[listener_id];
    delete listeners[listeners_id]
    listener.close();
  },

  registerListener: (listener) => {
    console.log(`Registering ${listener.hook_url}`);
    emitter = new DockerEventsEmitter(docker, listener.filters);
    listeners[listener.id] = listener;
    emitter.onEvent(data => {
      console.log(`Sending ${data.Type}#${data.Action} to ${listener.hook_url}`);

      try {
        request({ method: listener.hook_method, uri: listener.hook_url,json: data });
      } catch (e) {
        console.log(e.toString());
      }

    });
  },

  init: () => {
    var listeners = db.get('listeners').value();
    for (var i = 0; i < listeners.length; i++) {
      DockerEventsHub.registerListener(listeners[i]);
    }
  }

}

module.exports = DockerEventsHub;
