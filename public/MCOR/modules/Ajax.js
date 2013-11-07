/*
 * Class: MCOR.Ajax
 * A class for the Ajax functions
 */
MCOR.Ajax = {
  /*
	 * Function: getTransport
	 * This should only be used by other Ajax functions
	 * Returns: new XMLHttpRequest
	 *
	 */
	getTransport: function() {
  		return new XMLHttpRequest()  	
  },
  
  /*
   * Funciton: Request
   * This is the main Request Function for Ajax Requests
   * 
   * Parameters:
   * 	url - {URL} The url for the request
   * 	options - {OBJECT} the options for this request
   * 			{
   * 				method : ['GET','POST','PUT','DELETE'] // The possible methods. Default is GET
   *                          GET will return a json array or object. POST & PUT returns the location of the affected resource. DELETE returns true or false
   * 				async : [true,false] // is it asynchronous. There is very few times where you want to make this no. Default is true
   * 				parameters : [json object] // this is the payload of POST or PUT request. Default is 'send' which is just a placeholder word
   * 				oncomplete : [function] // the function to preform when the request is complete. default  
   * 			}
   */
  
  Request : function(url, options){
	this.method = 'GET';
	this.async = true;
	this.parameters = 'send';		

	var transport = MCOR.Ajax.getTransport();

	var onComplete = function(resp){

	}; 	

	if(options.hasOwnProperty('method'))
		this.method = options.method

	if(options.hasOwnProperty('async'))
		this.async = options.async

	if(options.hasOwnProperty('parameters'))
		this.parameters = options.parameters

	if(options.hasOwnProperty('onComplete'))
		onComplete = options.onComplete

	transport.onreadystatechange = function() {
		//Checks for Login Status
		if(transport.readyState==4 && transport.status==550) {
			//this is permission denied.
			MCOR.statusCatcher(transport.status);						
		}
  		if (transport.readyState==4 && transport.status==200) {
  			//need a try statement here
  			//This regex is supposed to take the place of 
  			if (/^[\],:{}\s]*$/.test(transport.responseText.replace(/\\["\\\/bfnrtu]/g, '@').replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {
				transport.responseJSON = JSON.parse(transport.responseText);
			}
    		onComplete(transport);
   		}
   		if(transport.readyState==4 && transport.status==201) {
   			//need a try statment here
  			//transport.responseJSON = JSON.parse(transport.responseText);
   			transport.resourceLocation = transport.getResponseHeader('Location');
   			onComplete(transport);
   		}
   		if(transport.readyState==4 && transport.status==204) {
   			transport.resourceLocation = transport.getResponseHeader('Content-Location');
   			onComplete(transport);
   		}
   		if(transport.readyState==4 && transport.status==202) {
   			onComplete(transport);
   		}
  	}
  	
  	transport.open(this.method,url,this.async);
  	transport.setRequestHeader('Access-Control-Allow-Origin','*');
	transport.setRequestHeader('Access-Control-Allow-Methods',this.method);
	transport.setRequestHeader('Access-Control-Allow-Headers','Content-Type');
	//TODO adding a little bit of control here
	if(['post','POST','PUT','put'].indexOf(this.method) > -1){
		//makes it a form
		transport.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		try{
			var output = JSON.parse(this.parameters);
			//makes it more like a form.. don't know if this is good or not but it is what i am doing
			this.parameters = 'params='+this.parameters;
		} catch(e){}
	}
  	transport.send(this.parameters);		
	}
};

MCOR.Ajax.PostForm = function(formId, options){};