var app = require('./app.js')
var port = process.env['PORT'] || 3000

app.listen(port, function () {
  console.log(`docker monitor listening on port ${port}!`);
});
