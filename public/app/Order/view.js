POS.Order.View = new POS.View({
	//Setup Stuff
	name:'Order Views',
	controller : POS.Order.Controller,
	
	/*
	 * add Order 
	 */
	
	add : function(){
		var content = $nE('div', {"id":"newOrder"},[
			$nE('div', {"id":"newOrderNumberContainer"}, [
				$nE('label', {"for":"newOrderNumber"}, $cTN('Order Number')),
				$nE('input', {"id":"newOrderNumber", "class":"input", "name":"order_number", "disabled":"disabled"})
			]),
			$nE('div', {"id":"newNameContainer"}, [
				$nE('label', {"for":"newNameField"}, $cTN('Name')),
				$nE('input', {"id":"newNameField", "class":"input", "name":"name"})
			]),
			$nE('div', {"id":"OrderItemsContainer"}, [
				$nE('ul', {"id":"OrderItemsList"}),
				$nE('button', {'id':"newOrderItemButton","class":"btn btn-primary"},$cTN('Add Item'))
			])
		]);
		
		return content;
	},
	
	_item : function(){
		var content = $nE('li',null,$cTN('Item Added'));
		
		return content;
	}
});	