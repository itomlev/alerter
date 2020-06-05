const express = require('express');
const router = express.Router();

router.post('/echoAtTime', function (req, res, next) {
	console.log(`POST /echoAtTime`);
	res.sendStatus(200);
});

module.exports = router;
