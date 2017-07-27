var Readable = require("stream").Readable;

module.exports = getReadable;

function getReadable(str) {
	var s = new Readable();
	s._read = Function.prototype; // noop
	s.push(str);
	s.push(null);
	return s;
}
