POS.Order.Controller = new POS.Controller({
	name:'Order Controller',
	model: MCOR.Models.Order,
	
/*
 * load_add
 */
	load_add : function(){
		document.body.innerHTML = '';

		this.load_view(this.view.add(),document.body);
		
		var addItem = $g('newOrderItemButton');
		addItem.addEventListener('click', this._load_item.bind(this));
	},
	
	_load_item : function(){
		var itemLi = this.view._item();
				
		this.load_view(itemLi, $g('OrderItemsList'));
	}

});