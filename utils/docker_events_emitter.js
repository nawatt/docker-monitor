JSONStream = require('JSONStream');

class DockerEventsEmitter {
  constructor(docker, filters) {
    this.docker = docker;
    this.filters = filters;

    this.objectStream = JSONStream.parse();
    this.objectStream.on('data', (data) => {
      if (this.callback) this.callback(data);
    });
  }

  _loadStream() {
    this._streamLoading = true;
    var options = {
      filters: JSON.stringify(this.filters)
    }
    console.log(`Listening for events with options`);
    console.log(options);
    this.docker.getEvents(options, (err, rawStream) => {
      if (err) console.log(err);
      this.rawStream = rawStream;
      rawStream.pipe(this.objectStream);
    });
  }

  onEvent(callback) {
    if (!this.rawStream && !this._streamLoading) this._loadStream();
    this.callback = callback;
  }

  close() {
    this.rawStream.destroy();
    this.objectStream.destroy();
  }
}

module.exports = DockerEventsEmitter;
