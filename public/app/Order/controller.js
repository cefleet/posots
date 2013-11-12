POS.Order.Controller = new POS.Controller({
	name:'Order Controller',
	model: MCOR.Models.Order,
	
/*
 * load_add
 */
	load_add : function(){

		document.body.innerHTML = '';
		this.orderDetails = {order_items:{}};
		
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
			this.orderDetails.order_number = orderNumber;
			
			var custName = $g('newNameField');
			var custDisplay = $g('DisplayCustomer');
			
			this.orderDetails.name = custName.value;
			
			custName.addEventListener('keyup', function(){
				custDisplay.innerHTML = custName.value;
				this.orderDetails.name = custName.value;
			}.bind(this));
		}.bind(this));
		
		this.reviewContent = $g('reviewView').innerHTML;
		//setinterval..yeah
		var checkChanges = setInterval(function(){
			var reviewContent = $g('reviewView').innerHTML;
			if(this.reviewContent != reviewContent){
				this.update_totals();
				this.reviewContent = reviewContent
			}
		}.bind(this), 200);
		
		var submitButton = $g('submitOrder');
		submitButton.addEventListener('click', this._submit_order.bind(this));		
	},
	
	_submit_order : function(){
		//TODO get all of the values for each item on the left side. to make the order and put it into a JSON array.
		console.log(this.orderDetails);
		this.save_item(this.orderDetails, function(){
			//todo send ot printer. .. hehee
			this.load_add();
		}.bind(this));		
	},
	
	_load_item : function(){
		var itemLi = this.view._item();
		this.load_view(itemLi, $g('OrderItemsList'));
			
		var reviewItemLi = this.view._review_item(itemLi.id);
		this.load_view(reviewItemLi, $g('reviewItemList'));
		
		this.orderDetails.order_items[itemLi.id] = {};
		
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
		deleteButton.addEventListener('click', function(e){
			var reviewItem = $g('review_'+e.target.parentNode.parentNode.id);

			delete this.orderDetails.order_items[e.target.parentNode.parentNode.id];

			e.target.parentNode.parentNode.parentNode.removeChild(e.target.parentNode.parentNode);
			reviewItem.parentNode.removeChild(reviewItem);

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
		var containerId = itemDetails.parentNode.id;
		this.orderDetails.order_items[containerId].item_id = itemId;
		this.orderDetails.order_items[containerId].item_price = item.price;
		this.orderDetails.order_items[containerId].item_name = item.name;
	
		reviewName.innerHTML = item.name;		
	
		var priceInput = itemDetails.childNodes[0].childNodes[1];				
		priceInput.value = item.price;
		reviewPrice.innerHTML = item.price;
		
		priceInput.addEventListener('blur', function(){
			reviewPrice.innerHTML = priceInput.value;
			console.log(containerId);
			this.orderDetails.order_items[containerId].item_price = priceInput.value;
		}.bind(this));
				
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
				
				if(!this.orderDetails.order_items[rootId].modifiers){
					this.orderDetails.order_items[rootId].modifiers = {};
				}
				
				this.orderDetails.order_items[rootId].modifiers[item.name] = {
					modifier_label:item.label,
					modifier_price: item.price
				}			
				
				name.innerHTML = item.label;
				price.innerHTML = item.price;
				
			} else {
				var optionItem = $g('reviewOption_'+e.target.id);
				optionItem.parentNode.removeChild(optionItem);
				if(this.orderDetails.order_items[rootId].modifiers[item.name]){
					delete this.orderDetails.order_items[rootId].modifiers[item.name];
				}
			}
			
		}.bind(this));
	},
	
	update_totals: function(){
		var priceElements = $gCN(['priceItemForTotal'], $g('reviewView'));
		var total = 0;
		priceElements.forEach(function(elem){
			total = total+Number(elem.innerHTML);
		});
		
		this.orderDetails.subtotal = Number(total).formatMoney('2','.',',');
		this.orderDetails.taxrate = POS.constants.taxes.percent;
		this.orderDetails.salestax = Number((this.orderDetails.subtotal*Number(POS.constants.taxes.percent/100))).formatMoney('2','.',',');
		this.orderDetails.grandtotal = Number(Number(this.orderDetails.salestax)+Number(this.orderDetails.subtotal)).formatMoney('2','.',',');
		
		//TODO not loving this. Too much visulazations for a controller.. but meh
		//TODO make this a view for my sainity if you get a chance
		$g('totalsTotal').innerHTML = 'Subtotal : $'+this.orderDetails.subtotal;
		$g('totalsTaxPer').innerHTML = 'Tax Rate: '+this.orderDetails.taxrate+'%';
		$g('totalsTax').innerHTML = 'Sales Tax : $'+this.orderDetails.salestax;
		$g('totalsGrandTotal').innerHTML = 'Grand Total : $'+this.orderDetails.grandtotal;
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