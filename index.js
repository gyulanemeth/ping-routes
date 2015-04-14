var	fs			= require("fs"),
	redis		= require("redis"),
	mongoose	= require("mongoose"),
	health		= require("express-ping");


function sendPong(res) {
	res.setHeader("Content-Type", "text/plain");
	res.send("PONG");
}

module.exports = function attachHandlers(config) {
	var app = config.app;

	app.get("/ping", function(req, res) {
		sendPong(res);
	});


	if (config.redis) {
		var redisClient	= redis.createClient(config.redis.port, config.redis.url);

		redisClient.auth(config.redis.pass);
		redisClient.on("error", function(err) {
			console.log(err);
		});

		app.get("/ping/redis", function(req, res) {
			redisClient.hgetall("nonExistingPingHashForTest", function(err, result) {
				if (err) {
					return console.log("/ping/redis - unsuccessful hgetall");
				}

				sendPong(res);
			});
		});
	}
	

	if (config.mongo) {
		var pingModel = mongoose.model("Ping", new mongoose.Schema({
			createdAt: {type: Date, default: Date.now}
		}));

		app.get("/ping/mongo", function(req, res) {
			pingModel.findOne({}, function(err, result) {
				if (err) {
					return console.log("/ping/mongo - unsuccessful findOne");
				}

				sendPong(res);
			});
		});
	}
	
	if (config.file) {
		app.get("/ping/file", function(req, res) {
			fs.writeFile("./pingFileTest", "PONG", {encoding: "utf8"}, function(err) {
				if (err) {
					return console.log("/ping/file - unsuccessful fs.writeFile");
				}

				fs.readFile("./pingFileTest", {encoding: "utf8"}, function(err, result) {
					if (err) {
						return console.log("/ping/file - unsuccessful fs.readFile");
					}

					fs.unlink("./pingFileTest", function(err) {
						if (err) {
							return console.log("/ping/file - unsuccessful fs.unlink");
						}

						sendPong(res);
					});
				});
			});
		});
	}
	
	if (config.sysinfo) {
		app.use(health.ping("/ping/sysinfo"));
	}
};
