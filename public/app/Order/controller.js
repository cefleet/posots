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
			var orderField = $g('newOrderNumber');
			orderField.value = orderNumber;
			
			var display = $g('DisplayOrderNumber');
			//INNER HTML ok for just a non html item ie text
			display.innerHTML = orderNumber;
			
			var custName = $g('newNameField');
			var custDisplay = $g('DisplayCustomer');
			
			custName.addEventListener('keyup', function(){
				custDisplay.innerHTML = custName.value;	
			});
		});		
	},
	
	_load_item : function(){
		var itemLi = this.view._item();
		this.load_view(itemLi, $g('OrderItemsList'));
		
		var reviewItemLi = this.view._review_item(itemLi.id);
		this.load_view(reviewItemLi, $g('reviewItemList'));
		
		var dropdown = itemLi.childNodes[0].childNodes[0];

		//If it has not been refreshed it does not hit the DB. This is a good solution		
		if(this.itemsList) {
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
		
		var deleteButton = 	itemLi.childNodes[0].childNodes[1];
		deleteButton.addEventListener('click', function(){
			var reviewId = $g('review_'+this.parentNode.parentNode.id);
			this.parentNode.parentNode.parentNode.removeChild(this.parentNode.parentNode);
			reviewId.parentNode.removeChild(reviewId);
			//TODO recalculate total
		});
		
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
		var reviewLi = $g('review_'+container.id);
		$rAC(reviewLi.childNodes[0].childNodes[1]);

		var reviewName = reviewLi.childNodes[0].childNodes[0].childNodes[0];
		var reviewPrice = reviewLi.childNodes[0].childNodes[0].childNodes[1];
		
		if(container.childNodes[1]){
			container.removeChild(container.childNodes[1]);
		}
		
		var itemDetails = this.view._item_details();
		
		this.load_view(itemDetails, container);
		
		var item = this.itemsList[itemId];
		reviewName.innerHTML = item.name;		
	
		var priceInput = itemDetails.childNodes[0].childNodes[1];				
		priceInput.value = item.price;
		reviewPrice.innerHTML = item.price;
		
		priceInput.addEventListener('blur', function(){
			reviewPrice.innerHTML = priceInput.value;
		});
				
		for(var option in item.options){
			//TODO a function is needed here
			this._add_option(item.options[option], container);	
		}
	},
	
	_add_option : function(item, container){
		var rand = $uid();
		var itemOption = this.view._item_option();
		this.load_view(itemOption, container.childNodes[1].childNodes[1].childNodes[0]);
		itemOption.childNodes[0].value = item.name;
		itemOption.childNodes[0].id = rand;
					
		$aC(itemOption.childNodes[1], [$cTN(item.label+' - $'+item.price)]);

		itemOption.childNodes[1].setAttribute('for', rand);			
		itemOption.childNodes[0].addEventListener('change', function(e){
			//TODO make this different
			var rootId = itemOption.parentNode.parentNode.parentNode.parentNode.id;
			var checkBoxId = e.target.id;
			var optionType = e.target.value;
			var container = $g('review_'+rootId).childNodes[0].childNodes[1];
			if(e.target.checked){
				var optionView = this.view._review_item_option(checkBoxId);
				this.load_view(optionView, container);
				var name = optionView.childNodes[0];
				var price = optionView.childNodes[1];
				
				name.innerHTML = item.label;
				price.innerHTML = item.price;
				
			} else {
				var optionItem = $g('reviewOption_'+e.target.id);
				optionItem.parentNode.removeChild(optionItem);
			}
		}.bind(this));
	},
	
	next_order : function(callback){
		new MCOR.Ajax.Request('api/get_single/misc?id=misc', {
			method:'get',
			onComplete: function(resp){
				var values = resp.responseJSON;
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