var app = require('./app.js');
var request = require('request');
var Docker = require('dockerode');
var docker = new Docker();

app.listen(8889, () => {
  console.log("app is running ..");
  test1();
})

function test1() {
  console.log('Running test1 ...');
  request({
    uri: 'http://localhost:8889/listeners',
    method: 'POST',
    json: {
      hook_url: 'http://localhost:8889/hook_tester/container+start',
      hook_name: 'test1_start',
      hook_method: 'POST',
      app_name: 'com.example.com',
      filters: {
        type: ['container'],
        event: ['start']
      }
    }
  });

  request({
    uri: 'http://localhost:8889/listeners',
    method: 'POST',
    json: {
      hook_url: 'http://localhost:8889/hook_tester/container+die',
      hook_name: 'test1_stop',
      hook_method: 'POST',
      app_name: 'com.example.com',
      filters: {
        type: ['container'],
        event: ['die']
      }
    }
  });

  app.all('/hook_tester/:id', (req, res) => {
    if (req.params.id == req.body.Type + '+' + req.body.Action) {
      console.log(`=> Test1#${req.params.id}: success`);
    } else {
      console.log(`=> Test1#${req.params.id}: Fail`);
    }
  });

  console.log('running busybox as a sample container');
  docker.run('busybox', ['sh', '-c', 'uname -a'], process.stdout, function(err, data, container) {
    if (err) console.log(err);
    console.log(`status_code: ${data.StatusCode}`);
    console.log('removing container...');
    container.remove({}, (err, data) => {
      if (err) console.log(err);
      console.log('removed.');
      process.exit(0);
    });
  });
}
