MCOR.ModelItem = MCOR.Class({
	initialize : function(content,options){
		if(typeof options == 'undefined') options = {}
		this.content = {};
		MCOR.Util.extend(this.content, content);
		MCOR.Util.extend(this, options);
		this.id = $uid();
		
		//This is for when it has a model (which it should all the time)
		if(this.model != null){
			if(typeof this.content[this.model.pk] != 'undefined'){
				this.id = this.content[this.model.pk];
			} 
			this.model.add_model_items([this]);
		}
		//This overrides what the model does if one is present
		if(options.hasOwnProperty('pk')){
			if(this.content.hasOwnProperty(options.pk)){
				if(typeof this.content[options.pk] != 'undefined'){
					this.id = this.content[options.pk];
				}
			}
		}
	}
});

MCOR.ModelItem.prototype = {
		
}