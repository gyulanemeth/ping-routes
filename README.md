# ping-routes
Ping routes for node.js

## Usage

var pingRoutes = require("ping-routes");

...

pingRoutes({
	app: app,
	sysinfo: true,
	mongo: true,
	file: true,
	redis: {
		port: 1337, //your redis port
		url: "yourRedisUrl",
		pass: "yourRedisPass"
	}
});

where app is an express application.


With the configuration above, the pingRoutes function will add the following routes to your app:
 * /ping
 	* The response of this should be PONG. (with text/plain content type).
 * /ping/sysinfo
 	* This route uses express-ping.
 * /ping/mongo
 	* The response of this should be PONG. (with text/plain content type).
 	* Queryies an empty collection in MongoDB through the default connection.
 * /ping/file
 	* The response of this should be PONG. (with text/plain content type).
 	* Writes 4 bites to a file, reads and deletes it.
 * /ping/redis
 	* The response of this should be PONG. (with text/plain content type).
 	* Queryies a non existing hash from redis.

