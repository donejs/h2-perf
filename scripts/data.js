var fs = require("fs");
var Readable = require("stream").Readable;
var goal = 10 << 20; // 10mb

var pth = process.cwd() + "/ff.js";

var makeText = function(c){
  return `var a${c} = 11;\n`;
};

var count = 0;

function next() {
  var w = fs.createWriteStream(pth, { flags: 'a' });
  readStr(makeText(++count)).pipe(w);

  w.on("close", function(){
		fs.stat(pth, function(err, stats){
			if(err) {
				return console.error("oh no", err);
			}

			if(stats.size < goal) {
				next();
			}
		});
  });
}

next();

function readStr(str) {
  var s = new Readable();
  s._read = Function.prototype;
  s.push(str);
  s.push(null);
  return s;
}
