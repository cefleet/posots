if(!POS.Order) POS.Order = {};
POS.Order.Model = new MCOR.Model('Order', {
	"pk":'_id',
	"dbTable":"order",
	"database":"posots",
	"structure":{
		fields: {
			id: {"label":"Id", "column":"_id"},
			order:{"column":"order"}
		}
	},
	"conType":"RAPI", 
	"databaseLabel":"POSOTS"
});	