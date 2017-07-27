var createStream = require("../string_stream");
var pushJS = require("../push_js");

module.exports = function(app, rate, cdn){
	var assets = [
		["/50k-1.js", join(1)],
		["/50k-2.js", join(2)],
		["/50k-3.js", join(3)],
		["/50k-4.js", join(4)],
		["/50k-5.js", join(5)]
	];

	app.get("/50k-multi/push", function(req, res){
		var push = pushJS(res, rate);
		assets.forEach(([pth, fpth]) => push(pth, fpth));
		createStream(page("", "PUSH")).pipe(res);
	});

	app.get("/50k-multi/no-push", function(req, res){
		createStream(page("", "No PUSH")).pipe(res);
	});

	app.get("/50k-multi/cdn", function(req, res){
		createStream(page(cdn, "CDN")).pipe(res);
	});
};

function page(root, type){
	return `
		<!doctype html>
		<html lang="en">
		<title>50k ${type}</title>

		<script src="${root}/50k-1.js"></script>
		<script src="${root}/50k-2.js"></script>
		<script src="${root}/50k-3.js"></script>
		<script src="${root}/50k-4.js"></script>
		<script src="${root}/50k-5.js"></script>
	`;
}

function join(n) {
	return `${__dirname}/../../public/50k-${n}.js`
}
