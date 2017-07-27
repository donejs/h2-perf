var createStream = require("../string_stream");
var pushJS = require("../push_js");

module.exports = function(app, rate, cdn){
	var fpth = `${__dirname}/../../public/500k.js`;

	app.get("/500k/push", function(req, res){
		pushJS(res, rate)("/500k.js", fpth);
		createStream(page("", "PUSH")).pipe(res);
	});

	app.get("/500k/no-push", function(req, res){
		createStream(page("", "No PUSH")).pipe(res);
	});

	app.get("/500k/cdn", function(req, res){
		createStream(page(cdn, "CDN")).pipe(res);
	});
};

function page(root, type){
	return `
		<!doctype html>
		<html lang="en">
		<title>500k ${type}</title>

		<script src="${root}/500k.js"></script>
	`;
}
