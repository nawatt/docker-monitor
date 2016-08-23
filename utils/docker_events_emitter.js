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
    this.docker.getEvents(this.filters, (err, rawStream) => {
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
