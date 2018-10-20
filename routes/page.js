var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', { title: 'Close2Home | Homepage' });
});
router.get('/upload', function(req, res, next) {
	res.render('upload', { title: 'Close2Home | Upload csv file' });
});

module.exports = router;
