var pushJS = require("../push_js");

module.exports = function(app){
	var assets = [
		["/50k-1.js", join(1)],
		["/50k-2.js", join(2)],
		["/50k-3.js", join(3)],
		["/50k-4.js", join(4)],
		["/50k-5.js", join(5)]
	];

	app.get("/50k-multi/push", function(req, res){
		var push = pushJS(res);
		assets.forEach(([pth, fpth]) => push(pth, fpth));
		res.send(page("", "PUSH"));
	});

	app.get("/50k-multi/no-push", function(req, res){
		res.send(page("", "No PUSH"));
	});

	app.get("/50k-multi/cdn", function(req, res){
		res.send(page("//my-cdn-8bfac.firebaseapp.com", "CDN"));
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
	`${__dirname}/../../public/50k-${n}.js`
}
