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
		var id = $uid();
		var content = $nE('li',{"id":id},[
			$nE('div', {"class":"ItemContainer"},[
				$nE('label', null, $cTN('Item')),
				$nE('select', {"name":"item", id:'dropdown_'+id})
			])	
		]);		
		return content;
	},
	
	_item_list : function(){
		var listItems = this.controller.itemsListForView;
		var content = [];
		listItems.forEach(function(item){
			content.push($nE('option', {"value":item.id}, $cTN(item.label)))
		});
		
		return content;
	},
	
	_item_details : function(){
		var content = $nE('div', {"class":"itemContent"},[

			$nE('div', {"id":"newPriceContainer"}, [
				$nE('label', {"for":"newPriceField"}, $cTN('Price')),
				$nE('input', {"class":"input", "name":"price"})
			]),
			$nE('div', {"id":"ItemOptions"}, [
				$nE('ul', {"id":"ItemOptionsList"})
			])
		]);
		return content;
	},
	
	_item_option : function(){
		var content = $nE('div', {"class":"itemOptionCheckbox"}, 
			$nE('input', {"type":"checkbox","class":"checkbox"}, $nE('label'))
		);
		return content;
	}
});	