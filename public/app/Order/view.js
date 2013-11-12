POS.Order.View = new POS.View({
	//Setup Stuff
	name:'Order Views',
	controller : POS.Order.Controller,
	
	/*
	 * add Order 
	 */
	
	add : function(){
		var content = $nE('div', null, [ 
			$nE('div', {"id":"newOrder", "class":"span5"},[
				$nE('input', {"id":"newOrderNumber", "type":"hidden","name":"order_number"}),
				$nE('div', {"id":"newNameContainer"}, [
					$nE('label', {"for":"newNameField"}, $cTN('Customer Name')),
					$nE('input', {"id":"newNameField", "class":"input", "name":"name", "type":"text"})
				]),
				$nE('div', {"id":"OrderItemsContainer"}, [
					$nE('ul', {"id":"OrderItemsList", "class":"unstyled"}),
					$nE('button', {'id':"newOrderItemButton","class":"btn btn-primary"},$cTN('Add Item'))
				])
			]),
			$nE('div', {"id":"reviewPanel", "class":"span5"},[
				$nE('div', {"id":"reviewView", "class":"well well-small"},[
					$nE('div', {"id":"orderNumber"}, [
						$nE('span', {}, $cTN('Order # : ')),
						$nE('strong', {"id":"DisplayOrderNumber"})
					]),
					$nE('div', {"id":"customerName"}, [
						$nE('span', {}, $cTN('Customer : ')),
						$nE('strong', {"id":"DisplayCustomer"})
					]),
					$nE('ul', {"id":"reviewItemList", "class":"unstyled"}),
					$nE('div', {"id":"totalsBox", "style":"border-top:1px dashed"}, [
						$nE('div',{"class":"text-right", "id":"totalsTotal"}),
						$nE('div',{"class":"text-right", "id":"totalsTaxPer"}),
						$nE('div',{"class":"text-right", "id":"totalsTax"}),
						$nE('div',{"class":"text-right", "id":"totalsGrandTotal", "style":"border-top:1px solid"})
					])
				]),
				$nE('div', {}, 
					$nE('button', {"class":"btn btn-primary", "id":"submitOrder"},$cTN('Submit Order'))
				)
			])
		]);		
		return content;
	},
	
	_review_item : function(id){
		var content = $nE('li',{"id":'review_'+id, "class":"clearfix"},[
			$nE('div', {"class":"reviewItemContainer"},[
				$nE('div', {"class":"baseItem  clearfix"}, [
					$nE('span', {"class":"baseItemName pull-left"}),
					$nE('span', {"class":"baseItemPrice pull-right priceItemForTotal"})					
				]),
				$nE('ul', {"class":"reviewItemOptions"})
			]),
		]);		
		return content;
	},
	
	_review_item_option : function(id){
		var content = $nE('li',{"id":"reviewOption_"+id},[
			$nE('span', {"class":"optionItemName"}),
			$nE('span', {"class":"optionItemPrice pull-right priceItemForTotal"})
		]);
		
		return content;
	},
	
	_item : function(){
		var id = $uid();
		var content = $nE('li',{"id":id, "class":"well well-small"},[
			$nE('div', {"class":"ItemContainer"},[
				$nE('select', {"name":"item", id:'dropdown_'+id}),
				$nE('button',{"class":"btn btn-danger pull-right"}, $cTN('X'))	
			]),
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

			$nE('div', {"id":"newPriceContainer", "class":"input-prepend"}, [
				$nE('span', {"class":"add-on"}, $cTN('$')),
				$nE('input', {"class":"input span1", "name":"price", "type":"text"})
			]),
			$nE('div', {"id":"ItemOptions"}, [
				$nE('ul', {"id":"ItemOptionsList", "class":"unstyled inline"})
			])
		]);
		return content;
	},
	
	_item_option : function(){
		var content = $nE('li', {"class":"itemOptionCheckbox", "style":"padding: 0 16px 0"},[ 
				$nE('input', {"type":"checkbox","class":"checkbox"}),
				$nE('label', {"class":"label"})
			]
		);
		return content;
	}
});	