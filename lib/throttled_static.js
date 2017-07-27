var fs = require("fs");
var path = require("path");
var Throttle = require("throttle");

module.exports = function(pth, rate){
	var throttle = new Throttle(rate);

	return function(req, res, next){
		var filePth = path.join(pth, req.url);
		fs.stat(filePth, function(err){
			if(err) {
				return next();
			}

			var stream = fs.createReadStream(filePth);
			stream.pipe(throttle).pipe(res);
		});
	};
};
