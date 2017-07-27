var createStream = require("../string_stream");
var pushJS = require("../push_js");

module.exports = function(app, rate, cdn, size){
	var fpth = `${__dirname}/../../public/${size}.js`;

	app.get(`/${size}/push`, function(req, res){
		pushJS(res, rate)("/50k.js", fpth);
		createStream(page("", "PUSH", size)).pipe(res);
	});

	app.get(`/${size}/no-push`, function(req, res){
		createStream(page("", "No PUSH", size)).pipe(res);
	});

	app.get(`/${size}/cdn`, function(req, res){
		createStream(page(cdn, "CDN", size)).pipe(res);
	});
};

function page(root, type, size){
	return `
		<!doctype html>
		<html lang="en">
		<title>${size} - ${type}</title>

		<script src="${root}/${size}.js"></script>
	`;
}
