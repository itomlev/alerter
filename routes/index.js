const express = require('express');
const redis = require('redis');
const redisClient = redis.createClient(process.env.REDIS_PORT, process.env.REDIS_HOST);
const router = express.Router();

router.post('/echoAtTime', (req, res, next) => {
	//console.log(`POST /echoAtTime`);

	let reqBody = req.body;
	// validate input
	if (!validate(reqBody)) {
		return res.status(400).json({status: 'fail', message: 'invalid input'});
	}
	// persist in Redis
	let messageBody = `${reqBody.message}@@${reqBody.time}`;
	redisClient.zadd('messages', reqBody.time, messageBody);

	res.status(200).json({status: 'success', message: 'message has been registered successfully'});
});

router.get('/messages/:time', (req, res, next) => {
	//console.log(`GET /messages/:time`);

	let time = req.params.time;
	// Get messages up till ${time}
	redisClient.zrangebyscore('messages', 0, time, 'withscores', (error, members) => {
		if (error) {
			return res.status(400).json({status: 'fail', message: `error get messages by time ${time}. Error: ${error}`});
		}
		console.log(setToJson(members));
		res.status(200).json({status: 'success', message: setToJson(members)});
	});
});

router.get('/messages', (req, res, next) => {
	//console.log(`GET /messages`);

	// Get all messages
	redisClient.zrange('messages', 0, -1, 'withscores', (error, members) => {
		if (error) {
			return res.status(400).json({status: 'fail', message: `error get members ${error}`});
		}
		let items = setToJson(members);
		items.forEach(item => {
			console.log(item);
		});
		res.status(200).json({status: 'success', message: setToJson(members)});
	});
});

setToJson = (set) => {
	return set.reduce(function (a, c, i) {
		let idx = i / 2 | 0;
		if (i % 2) {
			a[idx].time = c;
		} else {
			let message = c.split('@@');
			a[idx] = { message: message[0] };
		}

		return a;
	}, []);
};

validate = (req) => {
	if (!req.time || !req.message) {
		return false;
	}
	return true;
};

printQueue = async () => {
	while(true) {
		let timestamp = new Date().getTime();

		try {
			redisClient.zrangebyscore('messages', 0, timestamp, 'withscores', (error, members) => {
				if (error) {
					throw error;
				}
				if (members.length > 0) {
					redisClient.zremrangebyscore('messages', 0, timestamp);
					let items = setToJson(members);
					items.forEach(item => {
						console.log(item);
					});
				}
			});
		} catch (error) {
			console.log(`error: ${error}`);
		}
		// Iterate the time every ${process.env.THRESHOLD_MS}ms
		await new Promise(r => setTimeout(r, process.env.THRESHOLD_MS));
	}
};

printQueue();

module.exports = router;
