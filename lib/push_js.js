var fs = require("fs");
var Throttle = require("throttle");
var zlib = require("zlib");

module.exports = function(res, rate){
	return function(pth, inpth){
		var throttle = new Throttle(rate);
		var out = res.push(pth, {
			status: 200,
			method: "GET",
			request: { accept: "*/*" },
			response: {
				"content-encoding": "gzip",
				"content-type": "application/javascript"
			}
		});

		fs.createReadStream(inpth)
			.pipe(zlib.createGzip())
			.pipe(throttle)
			.pipe(out);
	};
};
