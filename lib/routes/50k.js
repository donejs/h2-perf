var createStream = require("../string_stream");
var pushJS = require("../push_js");

module.exports = function(app, rate, cdn){
	var fpth = `${__dirname}/../../public/50k.js`;

	app.get("/50k/push", function(req, res){
		pushJS(res, rate)("/50k.js", fpth);
		createStream(page("", "PUSH")).pipe(res);
	});

	app.get("/50k/no-push", function(req, res){
		createStream(page("", "No PUSH")).pipe(res);
	});

	app.get("/50k/cdn", function(req, res){
		createStream(page(cdn, "CDN")).pipe(res);
	});
};

function page(root, type){
	return `
		<!doctype html>
		<html lang="en">
		<title>50k ${type}</title>

		<script src="${root}/50k.js"></script>
	`;
}
