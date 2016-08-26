var app = require('./app.js');
var request = require('request');

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
                action: ['start']
            }
        }
    });

    request({
        uri: 'http://localhost:8889/listeners',
        method: 'POST',
        json: {
            hook_url: 'http://localhost:8889/hook_tester/container+stop',
            hook_name: 'test1_stop',
            hook_method: 'POST',
            app_name: 'com.example.com',
            filters: {
                type: ['container'],
                action: ['stop']
            }
        }
    });

    console.log('please run a docker container so you can test requests');
    
    app.all('/hook_tester/:id', (req, res) => {
        console.log('body: ' + res.body);
        if (req.params.id == res.body.type + '+' + res.body.action)
            console.log('Test1: success');
        else
            console.log('Test1: Fail');
    });
}
