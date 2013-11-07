//something for strings
String.prototype.toProperCase = function () {
    return this.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
};

//convience for getElementById
function $g(e) { return document.getElementById(e) }

function $cTN(text){return document.createTextNode(text)}

//convience for getElementByTagName
function $gBT(tagNames,obj) {
	if (!obj) var obj = document;
	var resultArray = new Array();
	for (var i=0;i<tagNames.length;i++) {
		var tags = obj.getElementsByTagName(tagNames[i]);
		for (var j=0;j<tags.length;j++) {
			resultArray.push(tags[j]);
		}
	}
	var testNode = resultArray[0];
	if (!testNode) return [];
	if (testNode.sourceIndex) {
		resultArray.sort(function (a,b) {
				return a.sourceIndex - b.sourceIndex;
		});
	}
	else if (testNode.compareDocumentPosition) {
		resultArray.sort(function (a,b) {
				return 3 - (a.compareDocumentPosition(b) & 6);
		});
	}
	return resultArray;
}

//convience for getElementByClassName
function $gCN(classNames,obj) {
	if (!obj) var obj = document;
	var resultArray = new Array();
	for (var i=0;i<classNames.length;i++) {
		var classes = obj.getElementsByClassName(classNames[i]);
		for (var j=0;j<classes.length;j++) {
			resultArray.push(classes[j]);
		}
	}
	var testNode = resultArray[0];
	if (!testNode) return [];
	if (testNode.sourceIndex) {
		resultArray.sort(function (a,b) {
				return a.sourceIndex - b.sourceIndex;
		});
	}
	else if (testNode.compareDocumentPosition) {
		resultArray.sort(function (a,b) {
				return 3 - (a.compareDocumentPosition(b) & 6);
		});
	}
	return resultArray;
}


//convience for appendChild
function $aC(parent, elements){
	for(var i = 0; i < elements.length; i++){
		parent.appendChild(elements[i]);
	}
}

//combines
function $nE(tag,attributes,inside){
	var e = document.createElement(tag);
	$sA(e,attributes);
	if(inside != null){
		if(Array.isArray(inside)){
			for(var i=0; i<inside.length; i++){
				e.appendChild(inside[i]);
			}
		} else {
			e.appendChild(inside);
		}
	}
	return e;
}
 
//convience wrapper for setattribute
function $sA(elem, attributes){
	for(var attribute in attributes){
		elem.setAttribute(attribute, attributes[attribute]);
	}
}

//removes all children
function $rAC(element){
	while (element.hasChildNodes()) {
    	element.removeChild(element.lastChild);
	}
}

function $uid(){
	function s4() {
  		return Math.floor((1+Math.random())*0x10000).toString(16).substring(1);
	};
	function guid() {
  		return s4()+s4()+'-'+s4()+'-'+s4()+'-'+s4()+'-'+s4()+s4()+s4();
	}
	return guid();
}

hasClass = function(el, cssClass) {
    return el.className && new RegExp("(^|\\s)" + cssClass + "(\\s|$)").test(el.className);
}

function toObj(obj, str) {
    return str.split(".").reduce(function(o, x) { return o[x] }, obj);
}