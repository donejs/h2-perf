var bytes = require("bytes");
var express = require("express");
var fs = require("fs");
var http = require("http");
var net = require("net");
var spdy = require("donejs-spdy");
var addLatency = require("./latency");
var throttledStatic = require("./throttled_static");
var argv = require('yargs').argv;

module.exports = function({
	port = 8080,
	proxy = null,
	rate = "1kb",
	latency = 2,
	key,cert
} = {}){
	var cdn = `//localhost:${proxy}`;
	var httpPort = port + 1;
	var httpsPort = port + 2;


	rate = bytes.parse(rate);

	console.error(`Throttling at ${rate}, with ${latency}ms of latency`);

	var app = express();

	app.use(addLatency(latency));

	var httpsServer = spdy.createServer({
		key: fs.readFileSync(key),
		cert: fs.readFileSync(cert),
		spdy: {
			protocols: ['h2', 'http/1.1']
		}
	}, app);
	httpsServer.listen(httpsPort);

	var httpServer = http.createServer(app);
	httpServer.listen(httpPort);

	net.createServer(function(conn){
		conn.once("data", function (buf) {
				// A TLS handshake record starts with byte 22.
				var address = (buf[0] === 22) ? httpsPort : httpPort;
				var proxy = net.createConnection(address, function(){
					proxy.write(buf);
					conn.pipe(proxy).pipe(conn);
				});
			});
	}).listen(port);

	app.use(throttledStatic(`${__dirname}/../public`, rate));
	

	app.get("/", function(req, res){
		res.sendFile(`${__dirname}/views/index.html`);
	});

	var testCase = require("./routes/single").bind(null, app, rate, cdn);

	testCase("50k");
	testCase("500k");

	/*require("./routes/50k")(app, rate, cdn);
	require("./routes/500k")(app, rate, cdn);
	require("./routes/50k-multi")(app, rate, cdn);
	require("./routes/500k-multi")(app, rate, cdn);*/

	console.error(`Listening at https://localhost:${port}`);

	if(proxy) {
		console.error(`CDN Proxy https://localhost:${proxy}`);
	}

	return app;
};

var opts = Object.assign({}, argv, {
	port: process.env.PORT || argv.port
});

module.exports(opts);
