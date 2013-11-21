POS.Controller = MCOR.Class({
	initialize : function(options){
		MCOR.Util.extend(this,options);
	},
	load_view: function(view, into){
		//view needs to be a DOM object
		$aC(into, [view]);
	},
	//TODO this requires a model of the same name
	save_item : function(content, callback){	
		if(this.model instanceof MCOR.Model){
			this.model.create_item(content,callback);
		}
	},
	update_item : function(id, content, callback){	
		if(this.model instanceof MCOR.Model){
			this.model.update_item(id,content,callback);
		}
	},
	get_all : function(callback,view){
	    var view = view || null;
		if(this.model instanceof MCOR.Model){
			this.model.get_list(view,callback);
		}
	}
});
