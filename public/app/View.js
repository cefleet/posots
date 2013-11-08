POS.View = MCOR.Class({
	initialize : function(options){
		MCOR.Util.extend(this,options);
		if (this.controller instanceof POS.Controller){
			this.apply_to_controller(this.controller);
		}
	},
	/*
	 * Creates a view that can be called from the controller
	 */
	//TODO make a controller as well?
	create_view: function(viewName, dom){
		this.views[viewName] = dom
		return true;
	},
	apply_to_controller: function(controller){
		if(controller instanceof POS.Controller){
			controller.view = this;
		}
	}
});
