POS.View = MCOR.Class({
	initialize : function(options){
		MCOR.Util.extend(this,options);
		this.views = this.views || {}
	},
	/*
	 * Creates a view that can be called from the controller
	 */
	//TODO make a controller as well?
	create_view: function(viewName, dom){
		this.views[viewName] = dom
		return true;
	}
});
