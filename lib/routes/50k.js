var pushJS = require("../push_js");

module.exports = function(app){
	var fpth = `${__dirname}/../../public/50k.js`;

	app.get("/50k/push", function(req, res){
		pushJS(res)("/50k.js", fpth);
		res.send(page("", "PUSH"));
	});

	app.get("/50k/no-push", function(req, res){
		res.send(page("", "No PUSH"));
	});

	app.get("/50k/cdn", function(req, res){
		res.send(page("//my-cdn-8bfac.firebaseapp.com", "CDN"));
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
