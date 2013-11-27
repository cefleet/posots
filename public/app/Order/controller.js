POS.Order.Controller = new POS.Controller({
	name:'Order Controller',
	model: MCOR.Models.Order,
	
	load_start : function(){
	    document.body.innerHTML = '';
	    this.load_view(this.view.start(),document.body);
	    
	    var manageItems = $g('manageItems');
		manageItems.addEventListener('click', 
		    POS.Item.Controller.load_list.bind(POS.Item.Controller));
		
		var takeOrders = $g('takeOrdersViewButton');
		takeOrders.addEventListener('click', this.load_add.bind(this));
		
		var viewOrders = $g('viewOrders');
		viewOrders.addEventListener('click', this.load_list.bind(this));
		
		var kitchenViewButton = $g('kitchenViewButton');
		kitchenViewButton.addEventListener('click', 
		    this.load_kitchen_view.bind(this));
		
		var registerViewButton = $g('registerViewButton');
		registerViewButton.addEventListener('click', 
		    this.load_register_view.bind(this));
	},
	
	add_back_button : function(){
	    this.load_view(this.view.back_button(),document.body);
	    var backB = $g('backButton');
	    backB.addEventListener('click', this.load_start.bind(this));
	},
/*
 * load_add
 */
	load_add : function(){

		document.body.innerHTML = '';
		
		this.add_back_button();
		
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
		    if(!$g('reviewView')){
		        clearInterval(checkChanges);   
		    } else {
		        var reviewContent = $g('reviewView').innerHTML;
			
			    if(this.reviewContent != reviewContent){
				    this.update_totals();
				    this.reviewContent = reviewContent;
			    }
		    }
		}.bind(this), 200);
		
		var submitButton = $g('submitOrder');
		submitButton.addEventListener('click', this._submit_order.bind(this));		
	},
	
	load_list : function(){
	    document.body.innerHTML = '';
	    this.add_back_button();
	    this.load_view(this.view.list(),document.body);
	    
	    //setinterval..yeah
		var refreshList = setInterval(function(){
		    
		    if(!$g('listAllOrdersTypes')){
		        clearInterval(refreshList);   
		    } else {
		        this.orders_list('pending');
    	        this.orders_list('paid');
	            this.orders_list('started');
	            this.orders_list('completed');
		    }
		}.bind(this), 2000);

	    this.orders_list('pending');
	    this.orders_list('paid');
	    this.orders_list('started');
	    this.orders_list('completed');
	},
	
	load_kitchen_view : function(){
	    document.body.innerHTML = '';
	    this.add_back_button();
	    this.load_view(this.view.kitchen_view(),document.body);
	    
	    var refreshList = setInterval(function(){
		    
		    if(!$g('kitchenView')){
		        clearInterval(refreshList);   
		    } else {
		        this.orders_list('paid',true);
	            this.orders_list('started',true);
		    }
		}.bind(this), 2000);
	    
	    this.orders_list('paid');
	    this.orders_list('started');
	    
	},
	
	load_register_view : function(){
	    document.body.innerHTML = '';
	    this.add_back_button();
	    this.load_view(this.view.register_view(),document.body);
	    var refreshList = setInterval(function(){
		    
		    if(!$g('registerView')){
		        clearInterval(refreshList);   
		    } else {
		        this.orders_list('pending');
		    }
		}.bind(this), 2000);
	    this.orders_list('pending');
	},
	
	_put_into_list : function(content, container){
	    var li = this.view._load_list_item(content.id);
	    $aC(container, [li]);
	    li.childNodes[0].innerHTML = content.order.order_number;
	    li.childNodes[1].innerHTML = ' - '+content.order.name;
	    li.childNodes[2].innerHTML = content.order.grandtotal;
	    li.data = content;
	    li.addEventListener('click',this._order_items_clicked.bind(this), true)
	},
	
	_order_items_clicked : function(e){
	    //TODO this is kinda ghetto 
	    var target = e.target;
	    if(e.target.tagName != 'LI'){
	        target = e.target.parentNode;
	    }
	    
        var id = target.id.replace('order_','');
        
        var modal = this.view._launch_item_modal();
        modal.data =target.data;
        
        //This just makes a header
        modal.childNodes[0].childNodes[0].innerHTML = 
            modal.data.order.order_number+' - '+modal.data.order.name;

        this._add_order_data_for_modal(modal);
        this._add_buttons_for_modal(modal);
        
        modal.childNodes[2].childNodes[1].addEventListener('click',function(){
             $('#orderModal').modal('hide'); 
        });
        
        $aC(document.body, [modal]);

        $('#orderModal').modal('show');
        $('#orderModal').on('hidden', function(){
            var elem = $g('orderModal')
            elem.parentNode.removeChild(elem); 
         });
	},
    
    _add_order_data_for_modal : function(modal){
        var modalBody = modal.childNodes[1];
        console.log(modal.data);
        var elemsList = [];  
    
        modalBody.childNodes[1].childNodes[0].innerHTML = 
            'Sub Total: $'+modal.data.order.subtotal;
            
        modalBody.childNodes[1].childNodes[1].innerHTML = 
            'Tax: $'+modal.data.order.salestax;
            
        modalBody.childNodes[1].childNodes[2].innerHTML = 
            'Grand Total: $'+modal.data.order.grandtotal;
        
        for(var id in modal.data.order.order_items){
            var elem = this.view._review_item(id);
            var order = modal.data.order.order_items[id];
            elem.childNodes[0].childNodes[0].childNodes[0].innerHTML = 
                order.item_name;
            
            elem.childNodes[0].childNodes[0].childNodes[1].innerHTML =
                order.item_price;
            
            //TODO do something with every item
            
            var modifersUl = elem.childNodes[0].childNodes[1];
            console.log(modifersUl);
            
            for(var optName in order.modifiers){
                var option = order.modifiers[optName];
                var optElem = this.view._review_item_option(id+'_'+optName);
                
                optElem.childNodes[0].innerHTML = option.modifier_label;
                optElem.childNodes[1].innerHTML = option.modifier_price;
                $aC(modifersUl,[optElem]);
            }
            
            elemsList.push(elem);
        }
        
        $aC(modalBody.childNodes[0],elemsList);
        //modal.childNodes[1].innerHTML = 'Order Details';
    },
    
	_add_buttons_for_modal : function(modal){
	    var btnLabel = 'Paid';
        var newStatus = 'paid';
        var canVoid = true;
        if(modal.data.order.status === 'paid'){
            newStatus = 'started';
            btnLabel = 'Started';
            canVoid = false;
        } else if(modal.data.order.status === 'started'){
            newStatus = 'complete';
            btnLabel = 'Complete';
            canVoid = false;
        } else if(modal.data.order.status === 'complete'){
           modal.childNodes[2].childNodes[0].style.visibility = 'hidden'; 
           canVoid = false;
        }
        
        modal.childNodes[2].childNodes[0].id = newStatus;
        modal.childNodes[2].childNodes[0].innerHTML = btnLabel;
        
        modal.childNodes[2].childNodes[0].addEventListener('click', function(e){
            console.log(e);
            this.change_status_of_item(e.target.id);
        }.bind(this));
        
        if(canVoid){
            modal.childNodes[2].childNodes[2].addEventListener('click', function(e){
                console.log(e);
                this.change_status_of_item('void');
            }.bind(this));
        } else {
            modal.childNodes[2].childNodes[2].style.display = 'none';
        }
	},
	
	change_status_of_item : function(newStatus){
	    console.log('The Status is about to be changed to '+newStatus+'!');
	    var modal = $g('orderModal');
	    modal.data.order.status = newStatus;
	    console.log(modal.data.order.id);
	    //set the data
	    this.update_item(modal.data._id, modal.data, function(d){
	        console.log(d);
	    });
	    //TODO if time // Send to socket IO for updating
	    
	    //close the modal
	    $('#orderModal').modal('hide');
	},
	
	orders_list : function(listName,reverse){
	    this.get_all(function(data){
	        var theList = $g(listName+'List');
    	    $g(listName+'List').innerHTML = '';
    	    if(reverse){
    	        data = data.reverse();
    	    }
	        data.forEach(function(item){
	            this._put_into_list(item.content, theList);
	        }.bind(this));
	    }.bind(this), {view:'get_all_'+listName}); 
	},
	
	
	_submit_order : function(){
		//TODO get all of the values for each item on the left side. to make the order and put it into a JSON array.
		this.orderDetails.status = 'pending';
		var dateObj = new Date();
		//this.orderDetails.placed = dateObj.getFullYear()+'-'+Number(dateObj.getMonth()+1)+'-'+dateObj.getDate()+' '+dateObj.getHours()+':'+dateObj.getMinutes()+':'+dateObj.getSeconds()+'.'+dateObj.getMilliseconds(); 
		this.orderDetails.placed = dateObj.toString();
		this.save_item({order:this.orderDetails}, function(){
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