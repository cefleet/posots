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
		
		this.next_order(function(orderNumber){
			//update the order number
			console.log(orderNumber);
			var orderField = $g('newOrderNumber');
			orderField.value = orderNumber;
		});		
	},
	
	_load_item : function(){
		var itemLi = this.view._item();
		this.load_view(itemLi, $g('OrderItemsList'));
		
		var dropdown = itemLi.childNodes[0].childNodes[1];

		//If it has not been refreshed it does not hit the DB. This is a good solution		
		if(this.itemsList) {
			console.log(dropdown); 
			this._fill_item_dropdown(dropdown);
			this._load_item_details(dropdown.value, itemLi);
		} else {
			POS.Item.Controller._create_list(function(data){
				this.itemsList = {};
				data.forEach(function(item){
					this.itemsList[item.id] = item.content.item; 
				}.bind(this));
				
				this._fill_item_dropdown(dropdown);
				this._load_item_details(dropdown.value, itemLi);
			}.bind(this));
		}		
		
				
		dropdown.addEventListener('change', function(){	
			this._load_item_details(dropdown.value, itemLi);
		}.bind(this));
				
	},
	
	_fill_item_dropdown:function(dropdown){
		
		if(!this.itemsListForView){
			var items = this.itemsList;

			this.itemsListForView = [];
			
			for(var i in items){
				this.itemsListForView.push({id:i,label:items[i].name})
			}
		};
		var itemsDropdown = this.view._item_list();
		
		itemsDropdown.forEach(function(item){
			this.load_view(item, dropdown);
		}.bind(this));
		
	},
	
	_load_item_details : function(itemId, container){
		if(container.childNodes[1]){
			container.removeChild(container.childNodes[1]);
		}
		
		var itemDetails = this.view._item_details();
		
		this.load_view(itemDetails, container);
		
		var item = this.itemsList[itemId];
		var priceInput = itemDetails.childNodes[0].childNodes[1];
				
		priceInput.value = item.price;
		
		for(var option in item.options){
			var itemOption = this.view._item_option();
			this.load_view(itemOption, container);
			
			itemOption.addEventListener('change', function(){
				console.log(this);
				console.log(this.value);
			});
		}
	},
	
	next_order : function(callback){
		new MCOR.Ajax.Request('api/get_single/misc?id=misc', {
			method:'get',
			onComplete: function(resp){
				var values = resp.responseJSON;
				console.log(values);
				callback(values.order_number.current);
				//update the ordernumber
				var num = Number(values.order_number.current);
				num++;
				values.order_number.current = ('000000' + num).slice(-6);
				values.id = 'misc';
				//Go ahead and add the next one
				new MCOR.Ajax.Request('api/update_item/misc?id=misc',{
					parameters:JSON.stringify(values),
					method:'put',
					onComplete: function(resp){}
				});
			}
		});
	}

});