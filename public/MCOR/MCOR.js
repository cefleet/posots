MCOR = {
	version : '.01a',
	Stores: {},
	Models: {}
}

//When it is minified from here Down will be the mini version of this
var libFiles = [
	"Util.js",
	"Class.js",
	"Model.js",
	"ModelItem.js",
	"Store.js"
];

for (var i=0, len=libFiles.length; i<len; i++) {
	document.write("<script src='MCOR/lib/" + libFiles[i] + "'></script>");
}

//load modules
document.write("<script src='MCOR/modules/Ajax.js'></script>");
