var POS = {
	init: function(){
		var OrderStructure = {
			fields: {
				id: {"label":"Id", "column":"_id"},
				order:{"column":"order"}
			}
		}		
		new MCOR.Model('Order', {"pk":'_id',"dbTable":"order","database":"posots","structure":OrderStructure,"conType":"RAPI", "databaseLabel":"POSOTS"});
		
		var ItemStructure = {
			fields: {
				id: {"label":"Id", "column":"_id"},
				item:{"column":"item"}
			}
		}		
		new MCOR.Model('Item', {"pk":'_id',"dbTable":"item","database":"posots","structure":ItemStructure,"conType":"RAPI", "databaseLabel":"POSOTS"});
	},
	
	POS.Items.list.init();
	
}

POS.init();


/*
//TODO this is just a test
MCOR.Models.Item.create_item(
	{item:{
		name : 'White Chocolate Mocha',
		price : 6.25,
		options: {
			decaf : {
				name:'decaf',
				label:'Decaf',
				price:0
			},
			lofat: {
				name:'lofat',
				label:'Lofat',
				price:0
			},
			whipped_cream: {
				name:'whipped_cream',
				label:'Whipped Cream',
				price:.50
			}
		}
	}},
	function(data){
		console.log(data);
	}
);


//TODO add a polling number to the node backend to get order number


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