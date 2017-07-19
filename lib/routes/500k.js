var pushJS = require("../push_js");

module.exports = function(app){
	var fpth = `${__dirname}/../../public/500k.js`;

	app.get("/500k/push", function(req, res){
		pushJS(res)("/50k.js", fpth);
		res.send(page("", "PUSH"));
	});

	app.get("/500k/no-push", function(req, res){
		res.send(page("", "No PUSH"));
	});

	app.get("/500k/cdn", function(req, res){
		res.send(page("//my-cdn-8bfac.firebaseapp.com", "CDN"));
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
