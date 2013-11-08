if(!POS.Item) POS.Item = {};
POS.Item.Model = new MCOR.Model('Item', {
	"pk":'_id',
	"dbTable":"item",
	"database":"posots",
	"structure":{
		fields: {
			id: {"label":"Id", "column":"_id"},
			item:{"column":"item"}
		}
	},
	"conType":"RAPI", 
	"databaseLabel":"POSOTS"
});