var POS = {
	MVCElements : ['Order','Item'],
	init: function(){
		
		POS.constants = {
			lists:{
				options: {
					lofat: {
						name:'lofat',
						label:'Low Fat',
						suggested_price:0
					},
					decaf: {
						name:'decaf',
						label:'Decaffinated',
						suggested_price:0
					},
					whipped_cream: {
						name:'whipped_cream',
						label:'Whipped Cream',
						suggested_price:.50
					},
					soy: {
						name:'soy',
						label:'Soy',
						suggested_price:0.50
					},
					tall: {
					    name:'tall',
					    label:'Tall',
					    suggested_price:0
					},
					short: {
					    name:'short',
					    label:'Short',
					    suggested_price:0
					},
					medium: {
					    name:'medium',
					    label:'Medium',
					    suggested_price:0
					}
				}
			},
			taxes: {
				percent:7
			}
		};
		
		//This kicks it off
		POS.Order.Controller.load_start();	
	}			
};

//Loads the needed files for the MVC elements
document.write("<script src='app/Controller.js'></script>");
document.write("<script src='app/View.js'></script>");

for (var i=0, len=POS.MVCElements.length; i<len; i++) {
	document.write("<script src='app/" + POS.MVCElements[i] + "/model.js'></script>");
	document.write("<script src='app/" + POS.MVCElements[i] + "/controller.js'></script>");
	document.write("<script src='app/" + POS.MVCElements[i] + "/view.js'></script>");
}

document.addEventListener('DOMContentLoaded', function() {
	//TODO add scripts here
	
	POS.init();
})

//Sample item

/*
 * "item": {
       "name": "White Chocolate Mocha",
       "price": 6.25,
       "options": {
           "decaf": {
               "name": "decaf",
               "label": "Decaf",
               "price": 0
           },
           "lofat": {
               "name": "lofat",
               "label": "Lofat",
               "price": 0
           },
           "whipped_cream": {
               "name": "whipped_cream",
               "label": "Whipped Cream",
               "price": 0.50
           }
       },
	"soy":{
		"name":"soy",
		"label":Soy",
		"price":"0"
	}
   }
 */

//Sample order

/*
 * "order": {
       "order_number": 1,
       "name": "Clint Fleetwood",
       "placed_time": "07-11-2013 10:52",
       "order_items": [
           {
               "item_id": "0618f78e1c4bf127b3506ab0120030f7",
               "item_name": "White Chocolate Mocha",
               "item_price": 6.25,
               "modifiers": [
                   {
                       "modifier_name": "decaf",
                       "modifier_price": 0
                   },
                   {
                       "modifier_name": "lofat",
                       "modifier_price": 0
                   }
               ]
           },
           {
               "item_id": "0618f78e1c4bf127b3506ab0120030f7",
               "item_name": "White Chocolate Mocha",
               "item_price": 6.25,
               "modifiers": [
               ]
           }
       ],
       "pre_tax": 12.5,
       "tax": 2.5,
       "total": 15
   }
 */

//TODO add a polling number to the node backend to get order number
/*

MCOR.Models.Item.get_list(null,function(data){
	var item = MCOR.Models.Item.store.content[0];
	MCOR.Models.Order.create_item(
	{order:{
		order_number:2,
		name:'Phillip Viohl',
		placed_time:'07-11-2013 11:04',
		order_items:[{
			item_id:item.id,
			item_name:item.content.item.name,
			item_price:item.content.item.price,
			//TODO this is not as possible
			modifiers:[{modifier_name:'decaf',modifier_price:0},{modifier_name:'lofat', modifier_price:0}]
		}],
		pre_tax:6.25,
		tax:1.25,
		total:7.50,
	}},
	function(data){
		console.log(data);
	}
)
});
*/
