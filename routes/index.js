const express = require('express');
const redis = require('redis');
const redisClient = redis.createClient();
const router = express.Router();

router.post('/echoAtTime', (req, res, next) => {
	console.log(`POST /echoAtTime`);

	// validate input
	if (!validate(req.body)) {
		return res.status(400).json({status: 'fail', message: 'invalid input'});
	}
	// save in Redis

	res.status(200).json({status: 'success', message: 'message has been registered successfully'});
});

validate = (req) => {
	if (!req.time || !req.message) {
		return false;
	}
	return true;
};

module.exports = router;
