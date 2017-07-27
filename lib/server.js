var express = require("express");
var compression = require("compression");
var fs = require("fs");
var http = require("http");
var net = require("net");
var spdy = require("donejs-spdy");
var throttledStatic = require("./throttled_static");
var argv = require('yargs').argv;

module.exports = function({port=8080,rate=0,key,cert} = {}){
	var cdn = "//my-cdn-8bfac.firebaseapp.com";
	var httpPort = port + 1;
	var httpsPort = port + 2;

	var app = express();

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

	app.use(compression());
	app.use(throttledStatic(`${__dirname}/../public`, rate));
	

	app.get("/", function(req, res){
		res.sendFile(`${__dirname}/views/index.html`);
	});

	require("./routes/50k")(app, rate, cdn);
	require("./routes/500k")(app, rate, cdn);
	require("./routes/50k-multi")(app, rate, cdn);
	require("./routes/500k-multi")(app, rate, cdn);

	console.error(`Listening at http://localhost:${port}`);

	return app;
};

var opts = Object.assign({}, argv, {
	port: process.env.PORT || 8080
});

module.exports(opts);
