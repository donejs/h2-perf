var fs = require("fs");
var gzipSize = require("gzip-size");
var Readable = require("stream").Readable;
var goal = 50000;

var pth = process.cwd() + "/500k.js";

var makeText = function(c){
  return `var a${c} = 11;\n`;
};

var count = 0;

function next() {
  var w = fs.createWriteStream(pth, { flags: 'a' });
  readStr(makeText(++count)).pipe(w);

  w.on("close", function(){
    var s = gzipSize.stream();
    fs.createReadStream(pth).pipe(s);
    s.on("gzip-size", function(size){
      if(size < goal) {
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
