var fs = require("fs");
var zlib = require("zlib");

module.exports = function(res){
	return function(pth, inpth){
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
			.pipe(out);
	};
};
