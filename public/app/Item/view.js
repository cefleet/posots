POS.Item.View = new POS.View({
	//Setup Stuff
	name:'Item Views',
	controller : POS.Item.Controller,	
	//Views
	
	/*
	 * List View
	 */
	list : function(){
		var content = $nE('div',{"id":"itemsListContainer"}, [
			$nE('table',{"id":"itemsTable"}),
			$nE('button', {'id':"addNewItem", "class":"btn btn-primary"}, $cTN('Add Item'))
		]);
		
		return content;
	},
	
	_list_row : function(row){
		var content = $nE('tr', {"id":row.id}, [
			$nE('td', null, $cTN(row.name)),
			$nE('td',null, $cTN(row.price))
		]);
		
		return content;
	},
	
	/*
	 * Add View
	 */
	add : function(){
		var content = $nE('div',{'id':"newItem"}, 
			[
				$nE('div', {"id":"newNameContainer"}, [
					$nE('label', {"for":"newNameField"}, $cTN('Name')),
					$nE('input', {"id":"newNameField", "class":"input", "name":"name"})
				]),
				$nE('div', {"id":"newPriceContainer"}, [
					$nE('label', {"for":"newPriceField"}, $cTN('Price')),
					$nE('input', {"id":"newPriceField", "class":"input", "name":"price"})
				]),
				$nE('div', {"id":"optionsContainer"}, [
					$nE('ul', {"id":"optionsList"}),
					$nE('button', {"id":"newOptionButton", "class":"btn btn-primary"}, $cTN('Add Option'))				
				]),
				$nE('button',{"id":"saveItemButton", "class":"btn btn-primary"}, $cTN('Save Item')),
				$nE('button',{"id":"cancelSaveItemButton", "class":"btn btn-primary"}, $cTN('Cancel'))
			]
		);
		return content;
	},
	
	/*
	 * This is called when the newOptionButton is clicked
	 */
	_option : function(){
		var id = $uid();
		var content = $nE("li", {"id":id},[
			$nE('div', {"class":"optionContainer"},[
				$nE('label', null, $cTN('Option')),
				$nE('select', {"name":"option"}, POS.Item.View._options_list())
			]),
			$nE('div', {"class":"optionPriceContainer"},[
				$nE('label',null, $cTN('Price')),
				$nE('input', {"name":"price"})
			]),
			$nE('button',{"class":"btn btn-danger"}, $cTN('X'))		
		]);
		
		return content;
	},
	
	/*
	 * This is the list of dropdowns for the _option function
	 */
	_options_list : function(){
		var options = POS.constants.lists.options;
		var content = [];
		
		for(var o in options){
			console.log(options[o]);
			content.push($nE('option', {"value":options[o].name}, $cTN(options[o].label)))
		}
	
		return content;
	},
	
	
});