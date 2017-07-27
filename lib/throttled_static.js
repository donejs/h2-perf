var fs = require("fs");
var path = require("path");
var Throttle = require("throttle");
var zlib = require("zlib");

module.exports = function(pth, rate){
	return function(req, res, next){
		var filePth = path.join(pth, req.url);
		var throttle = new Throttle(rate);

		function read(err){
			if(err) {
				next();
				return;
			}

			var stream = fs.createReadStream(filePth);
			if(/\.js/.test(filePth)) {
				res.setHeader("content-encoding", "gzip");
				res.setHeader("content-type", "application/javascript");
				stream = stream.pipe(zlib.createGzip());
			}
			stream.pipe(throttle).pipe(res);
		}

		try {
			fs.stat(filePth, read);
		} catch(ex) {
			// Diretory maybe
			next();
		}
	};
};
