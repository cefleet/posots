MCOR.Store = MCOR.Class({
	storeName: null,
	content: null,
	initialize : function(storeName,options){
		//If it is undefined create a name for it
		if(typeof storeName === 'undefined'){
			storeName = $uid();
		}
		this.storeName = storeName;
		MCOR.Util.extend(this, options);
		MCOR.Stores[storeName] = this;
		if(!this.hasOwnProperty('content')){
			this.content = [];
		}		
	}
});
