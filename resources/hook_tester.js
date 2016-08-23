var express = require('express');
var router = express.Router();

router.all('/:id', (req, res) => {
  console.log(`triggered on hook #${req.params.id} via ${req.method}`);
  console.log(req.body);
});

module.exports = router;
