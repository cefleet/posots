POS.Order.View = new POS.View({
	//Setup Stuff
	name:'Order Views',
	controller : POS.Order.Controller,

    start : function(){
        var content = $nE('div', {"class":"navbar"},
        $nE('div', {"class":"navbar-inner"},
        [
		    $nE('button', {"id":"manageItems", "class":"btn btn-primary"},$cTN('Manage Menu')),
		    $nE('button', {"id":"viewOrders", "class":"btn btn-primary"},$cTN('Orders View')),
		    $nE('button', {"id":"takeOrdersViewButton", "class":"btn btn-primary"},$cTN('Take Orders View')),
		    $nE('button', {"id":"kitchenViewButton", "class":"btn btn-primary"},$cTN('Kitchen View')),
		    $nE('button', {"id":"registerViewButton", "class":"btn btn-primary"},$cTN('Register View'))
	    ]))
	    
	    return content;
    },
	
	back_button : function(){
	    return $nE('div', 
	        {"class":"navbar"},
	        $nE('div', {"class":"navbar-inner"},
	            $nE('button', {"id":"backButton", "class":"btn"},
	                $cTN('Go Back')
	           )
	       )
	   );
	},
	
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
	
	list: function(){
	    var content = $nE('div',{"id":"listAllOrdersTypes"}, [
	        $nE('div', {"id":"pendingPanel", "class":"span4"}, [
	            $nE('h3', {}, $cTN('Pending Orders')),
	            $nE('ul', {"id":"pendingList", "class":"unstyled orderList"})
	        ]),
	         $nE('div', {"id":"paidPanel",  "class":"span4"}, [
	            $nE('h3', {}, $cTN('Paid Orders')),
	            $nE('ul', {"id":"paidList", "class":"unstyled orderList"})  
	        ]),
	         $nE('div', {"id":"startedPanel",  "class":"span4"}, [
	            $nE('h3', {}, $cTN('Started Orders')),
	            $nE('ul', {"id":"startedList", "class":"unstyled orderList"})  
	        ]),
	        //TODO make this one toggalbe
	         $nE('div', {"id":"completedPanel", "class":"clearfix span12"}, [
	            $nE('h3', {}, $cTN('Completed Orders')),
	            $nE('ul', {"id":"completedList", "class":"unstyled orderList span4"})  
	        ])
	    ]);
	    
	    return content;
	},
	
	register_view : function(){
	    var content = $nE('div',{'id':"registerView"},[
	        $nE('div', {"id":"pendingPanel","class":"span12"}, [
	            $nE('h3', {}, $cTN('Pending Orders')),
	            $nE('ul', {"id":"pendingList", "class":"unstyled orderList"})
	        ])
	    ]);
	   
	   return content;
	},
	
	kitchen_view : function(){
	    var content = $nE('div',{"id":"kitchenView"},[
	        $nE('div', {"id":"paidPanel", "class":"span5"}, [
	            $nE('h3', {}, $cTN('Paid Orders')),
	            $nE('ul', {"id":"paidList", "class":"unstyled orderList"})  
	        ]),
	         $nE('div', {"id":"startedPanel","class":"span5"}, [
	            $nE('h3', {}, $cTN('Started Orders')),
	            $nE('ul', {"id":"startedList", "class":"unstyled orderList"})  
	        ]),
	    ]);
	   
	   return content;
	},
	
	_load_list_item : function(id){
	    var content = $nE('li', {"id":"order_"+id,"class":"pull-left", "style":"width:100%"},[
	        $nE('span', {"class":"orderNumber pull-left"}),
	        $nE('span', {"class":"orderName pull-left"}),
	        $nE('span', {"class":"orderCost pull-right"})
	   ]);
	   return content;
	},
	
	_launch_item_modal : function(){
	    var content = $nE('div', {
	        "id":"orderModal", 
	        "class":"modal hide fade", 
	        "tabindex":"-1", 
	        "role":"dialog",
	        "aria-labelledby":"orderModalLabel",
	        "aria-hidden":"true"
	        },
	        [
	            $nE('div',{"class":"modal-header", "id":"orderNumber"}, [
	                $nE('h3')    
	            ]),
	            $nE('div', {"class":"modal-body", "id":"orderContent"},[
	                $nE('ul', {"class":"unstyled"}),
	                $nE('div', {"id":"totalsBox", "style":"border-top:1px dashed"}, [
						$nE('div',{"class":"text-right", "id":"totalsTax"}),
						$nE('div',{"class":"text-right", "id":"totalsGrandTotal", "style":"border-top:1px solid"})
					])
	            ]), 
	            $nE('div',{"class":"modal-footer", "id":"orderFooter"},[
	               $nE('button', {"class":"btn btn-large btn-primary"}),
	               $nE('button', {"class":"btn","id":"closeModal"}, $cTN('Close'))
	            ])
	        ])
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
			])
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