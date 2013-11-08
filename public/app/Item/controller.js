POS.Item.Controller = new POS.Controller({
	name:'Item Controller',
	model: MCOR.Models.Item,
	load_list: function(){
		document.body.innerHTML = '';
		this.load_view(this.view.list(),document.body);
		
		var newItem = $g('addNewItem');
		newItem.addEventListener('click', this.load_add.bind(this));
		
		var list = function(data){
			//This adds them 1by1 dont know if that is best
			var table = $g('itemsTable');
			data.forEach(function(rowContent){
				
				var row = rowContent.content;
				var rowData = {id:row.id,name:row.item.name,price:row.item.price};
				
				this.load_view(this.view._list_row(rowData),table);
				
			}.bind(this));
		}.bind(this)
		
		this.get_all(list);
	},
	
	/*
	 * Loads the add view
	 */
	load_add : function(){
		document.body.innerHTML = '';

		this.load_view(this.view.add(),document.body);
		
		//Adds the event listeners for this view
		var addOption = $g('newOptionButton');
		addOption.addEventListener('click', this._load_option.bind(this));
	
		var saveItem = $g('saveItemButton');
		saveItem.addEventListener('click', this._save_item.bind(this));
		
		var cancel = $g('cancelSaveItemButton');
		cancel.addEventListener('click', this.load_list.bind(this));
	},

	/*
	 * Loads the option when clicked
	 */	
	_load_option : function(){
		var optLi = this.view._option();
				
		this.load_view(optLi, $g('optionsList'));
		
		var options = optLi.childNodes[0].childNodes[1];
		var price = optLi.childNodes[1].childNodes[1];
		
		//sets the default value
		price.value = POS.constants.lists.options[options.value].suggested_price;
				
		options.addEventListener('change', function(){
			price.value = POS.constants.lists.options[options.value].suggested_price;
		});
		
		//removes the added option
		var remove = optLi.childNodes[2];
		remove.addEventListener('click', function(){
			//TODO this is not bound to the View Object so you can use this
			this.parentNode.parentNode.removeChild(this.parentNode);
		});
	},
	
	/*
	 * Saves the item
	 */
	_save_item : function(){
		//Get name and price
		var values = {
			name: $g('newNameField').value,
			price:$g('newPriceField').value,
			options:{}
		}
		
		var options = $g('optionsList').childNodes;
		
		for(var i =0; i<options.length; i++){
			var option = options[i];
			var optName = option.childNodes[0].childNodes[1].value;
			values.options[optName] = {
				name:optName,
				price:option.childNodes[1].childNodes[1].value,
				label:POS.constants.lists.options[optName].label
			};
		}	
		this.save_item({item:values}, this.load_list.bind(this));		
	},
	
	/*
	 * Creates a list of the possible items to be used elsewhere
	 */
	_create_list : function(callback){
		
		var list = function(data){
			//Format the list
			callback(results);
		};
		this.get_all(list);
		
	}
	
})
