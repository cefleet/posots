/*
 *var init = {
 * 	dbTable:"myDbTable",
 *  conType: "local",//local,server
 *  pk:"pkField",
 *  database:"myDatabase",
 *  structure : {fields: {fieldName:{label:"myLabel",column:"myColumn"}}, {fieldName2:{label:"myLabel2",column:"myColumn2"}}} 
 *}
 * 
 * 
 * new MCOR.Model('ModelName', init, {anyOther:'options'})
 */
MCOR.Model = MCOR.Class({

	  dbTable : null,
	  pk : null,
	  structure : null,

	  initialize : function(modelName){
	  	if(typeof modelName === 'undefined'){
	  		throw new Error("A Model cannot be initialized without a name.");
	  	}
  		var init = {};
  		var options = {};
  		this.structure = {};
  		
  		//This is the object when an item is initilized
  		if(arguments[1]){
  			init = arguments[1];
 		}
 		
  		//The extra options added to the model .. useful for modules
  		options = arguments[2];
  		
  		//If there is not a connection type it will be set to local
		if(!init.conType){
			init.conType = 'local';
		}
		
		//applying the items to the model
		this.modelName = modelName;
		this.dbTable = init.dbTable;
		this.conType = init.conType;
		this.pk = init.pk;
		this.database = init.database;
		this.structure = MCOR.Util.extend(this.structure, init.structure);
		
		//TODO this should error out of you are trying to do this local
		if(this.structure == 'auto'){
			this.get_structure();
		}
		
		//if it is local setup the database
		if(this.conType == 'local'){
			//TODO setup indexed db
		}
		
		if(this.structure == null){
			this.structure = {
				fields: {},
				order:[]	
			}
		}
		
		//TODO you will have odd results if you do not do something for times when the structure 'auto' is used
		if(!this.structure.hasOwnProperty('fields')){
			this.structure.fields = {};
		}
		if(!this.structure.hasOwnProperty('order')){
			this.structure.order = {};
		}
		
		MCOR.Util.extend(this, options);
		MCOR.Models[modelName] = this;
		this.store = new MCOR.Store(this.modelName);
	}
});

MCOR.Model.prototype = {
	/*
	 * Function: get_structure
	 * cannot test. Only usable if going to be server
	 */
	get_structure : function(){
		
		new MCOR.Ajax.Request('api/get_structure/'+this.dbTable, {
			onComplete: function(resp){
				resp.responseJSON.columns.forEach(function(column){
					this.structure.fields[column.column_name] = {
						label: column.column_name.replace('_',' ').toProperCase(),
						formType: 'text',
						column: column.column_name
					};
					if(column.column_name == this.pk){
						this.structure.fields[column.column_name].formType = 'hidden';
					}
					if(column.data_type == 'text'){
						this.structure.fields[column.column_name].formType = 'textarea';
					}
					this.structure.order.push(column.column_name);
				}.bind(this));
			}.bind(this)	
		});
	},
	
	/*
	 * Function: get_single
	 * Retrieves a single item from the Database and adds it to the model's store
	 * 
	 * Parameters: 
	 * id - {STRING} The id of the item that you want to retrive
	 * callback - {FUNCITON} the function that you want to exicute when the item has been retreived and created.
	 * 				The first argument in the callback is the newly creeated modelItem
	 */
	
	//TODO add fields option at the least
	get_single : function(id, callback){
		
		//LOCAL STORAGE
		if(this.conType == 'local'){
			//TODO use indexed DB				
		}		
		if(this.conType == 'LocS') {
			var localStoreData = JSON.parse(localStorage[MCOR.appName+".MCOR."+this.modelName]);
			var found = null;
			if(this.pk != null){
				localStoreData.forEach(function(dataItem,index){
					if(dataItem[this.pk] == id){
						found = dataItem;
					}
				}.bind(this));
			}
			if(found != null){
				this.set_single(found,callback);
			} else {
				callback(null);
			}		
		} else if(this.conType == 'RAPI'){
		
			//REST API		
			new MCOR.Ajax.Request('api/get_single/'+this.dbTable+'/?id='+id, {
				method:'get',
				onComplete: function(resp){
					var values = resp.responseJSON;
					console.log(values);
					this.set_single(values, callback);
				}.bind(this)
			});
		} else if(this.conType == 'WebSQL'){
			//we need a db connection
			var sql = "SELECT * FROM "+this.dbTable+" WHERE "+this.pk+" = '"+id+"'";
			var model = this;
			var transCB = function(tx, results){
					//there should only be 1
				var values = results.rows.item(0);
				model.set_single(values,callback);
			}
			var tran = function(tx){
				tx.executeSql(sql, [], transCB);
			}			
			this.WebSqlDB.transaction(tran);
		}
	},
	
	/*
	 * Funciton: get_list
	 * Retrieves a list of items from the database and stores them as modelItems in the model's store
	 * 
	 * Parameters:
	 * queryOptions - {OBJECT} an object that contains query options //More info needed
	 * callback - {FUNCITON} the function that you want to exicute when the items have been retreived and created.
	 * 				The first argument in the callback is an array of newly created modelItems
	 */
	get_list : function(queryOptions, callback){
		if(typeof queryOptions == 'undefined'){
			queryOptions = {};
		}
		if(this.conType == 'LocS') {
			//TODO this really really needs to be a connection module
			var localStoreData = JSON.parse(localStorage[MCOR.appName+".MCOR."+this.modelName]);			
			var results = localStoreData;
			
			if(queryOptions.hasOwnProperty('order')){
				results.sort(function(a, b) {
    				var a_value = a && a[this.orderByField].toUpperCase() || "",
        			b_value = b && b[this.orderByField].toUpperCase() || "";
    				return a_value.localeCompare(b_value);
				}.bind(queryOptions.order));
				
			}
					  
			 if(queryOptions.hasOwnProperty('limit')){
				var len = results.length;
				results.splice(queryOptions.limit, (len - queryOptions.limit))	
			}
			
			this.apply_list(results);	
		} else if(this.conType == 'RAPI'){
		
			//RESTAPI
			var queryString = '?randId='+$uid();
			
			/*for(option in queryOptions){
				queryString += '&conditions='.concat(option).concat(':'.concat(queryOptions[option])); 
			}		
			*/
			for(option in queryOptions){
			    queryString += '&'+option+'='+queryOptions[option];
			}
			new MCOR.Ajax.Request('api/get_list/'+this.dbTable+queryString, {
				method:'get',
				onComplete : function(resp){
					var values = resp.responseJSON;
					this.set_list(values,callback);								
				}.bind(this)
			});
		
		} else if(this.conType == 'WebSQL'){
			thisModel = this;
			
			//need a where statement
			var where = '1=1';
			if(queryOptions.hasOwnProperty('conditions')){
				if(Array.isArray(queryOptions.conditions)){
					for(var i = 0; i<queryOptions.conditions.length; i++){
					 where = where.concat(" AND "+queryOptions.conditions[i].field+" = '"+queryOptions.conditions[i].value+"'");
					}
				} else {
					where = where.concat(" AND "+queryOptions.conditions.field+" = '"+queryOptions.conditions.value+"'");
				}			
			}
			
			var sql = "SELECT * FROM "+this.dbTable+" WHERE "+where;
			var tranCB = function(tx, results){
				var len = results.rows.length;
				var values = [];
				for(var i = 0; i < len; i++){
					values.push(results.rows.item(i));
				};
				thisModel.set_list(values,callback);				
			}
			var trans = function(tx){
				tx.executeSql(sql,[],tranCB)
			}
			this.WebSqlDB.transaction(trans);		
		}
	},
	
	/*
	 * Function: create_item
	 * Creates a new database entry and retrieves thaat item and creates a new modelItem and adds it to the model's store.
	 * 
	 * Parameters:
	 * saveData - {OBJECT} The data to enter into the database (if a schema based database is used then if it does not follow the schema it could fail)
	 * callback - {FUNCITON} the function that you want to exicute when the item has been retreived and created.
	 * 				The first argument in the callback is the newly creeated modelItem
	 */
	
	create_item : function(saveData, callback){	
		//TODO make different connection modes as part of the core
		if(this.conType == 'LocS') {
			//LOCALSTORAGE
			var localStoreData = JSON.parse(localStorage[MCOR.appName+".MCOR."+this.modelName]);
			
			//TODO this should be handeled like an ajax request
			var found = null;
			if(this.pk != null){
				localStoreData.forEach(function(dataItem,index){
					if(dataItem[this.pk] == saveData[this.pk]){
						found = {index:index}
					}
				}.bind(this));
			}
			if(found == null){
				localStoreData.push(saveData); 
			}else{
				localStoreData[found.index] = saveData;
			}
			localStorage[MCOR.appName+".MCOR."+this.modelName] = JSON.stringify(localStoreData);
			
			this.set_single(saveData,callback);
					
		} else if(this.conType == 'RAPI'){
			//RESTAPI
			var postData = JSON.stringify(saveData);
			new MCOR.Ajax.Request('api/add_item/'+this.dbTable, {
				parameters:postData,
				method:'post',
				onComplete : function(resp){
					
					var loc = resp.resourceLocation;				
					if(loc){
						var id = loc.replace('api/get_single/'+this.dbTable+'/?id=','');
						this.get_single(id,callback);								
					} else {
						var id = resp.responseJSON.id;
						this.get_single(id,callback);
					}
				}.bind(this)			
			});
		} else if(this.conType == 'WebSQL'){
			var fields = [];
			var values = [];
			var qs= [];
			for(var field in saveData){
				fields.push(field)
				values.push(saveData[field]);
				qs.push('?');				  
			}
			var sql = "INSERT INTO "+this.dbTable+" ("+fields.join()+') VALUES ('+qs.join()+')';
			var thisObj = this;
			
			var tran = function(tx){
				tx.executeSql(sql, values, transCB);
			}
			
			var transCB = function(tx, results){
				thisObj.set_single(saveData, callback);
			}		
			this.WebSqlDB.transaction(tran);
		}		
	},
	
	/*
	 * Function: update_item
	 * Updates an existing record in the database and replaces the model's store old record with the new record
	 * 
	 * Parameters:
	 * id - {STRING} the id of the item that is being updated
	 * saveData - {OBJECT} the data to replace the old data in the database with
	 * callback - {FUNCITON} the function that you want to exicute when the item has been retreived and created.
	 * 				The first argument in the callback is the newly creeated modelItem
	 */
	
	update_item : function(id, saveData, callback){
		
		if(this.conType == 'LocS') {
			//LOCALSTORAGE
			var localStoreData = JSON.parse(localStorage[MCOR.appName+".MCOR."+this.modelName]);
			
			//TODO this should be handeled like an ajax request
			var found = null;
			if(this.pk != null){
				localStoreData.forEach(function(dataItem,index){
					if(dataItem[this.pk] == id){
						found = {index:index};
					}
				}.bind(this));
			}
			if(found == null){
				localStoreData.push(saveData); 
			}else{
				localStoreData[found.index] = saveData;
			}
			localStorage[MCOR.appName+".MCOR."+this.modelName] = JSON.stringify(localStoreData);			
			this.set_single(saveData,callback);
					
		} else if(this.conType == 'RAPI'){
			var putData = JSON.stringify(saveData);
			new MCOR.Ajax.Request('api/update_item/'+this.dbTable+'?id='+id,{
				parameters:putData,
				method:'put',
				onComplete: function(resp){
					var loc = resp.resourceLocation;
					id = loc.replace('api/get_single/'+this.dbTable+'/?id=','');
					this.get_single(id,callback);				
				/*
				 * THIS IS HOW IT WAS ... DO NOT DELETE untill test have been completed with the new way				 
				this.get_single(id, function(modelItem){
					callback(modelItem);
				});
				*/
				}.bind(this)
			});
		} else if(this.conType == 'WebSQL')	{
			var fields = [];
			var values = [];
			var qs= [];
			for(var field in saveData){
				fields.push(field+" = '"+saveData[field]+"'")
				//values.push(saveData[field]);
			}
			var sql = "UPDATE "+this.dbTable+" SET "+fields.join()+" WHERE "+this.pk+" = '"+id+"'";
			var thisObj = this;
			
			var tran = function(tx){
				console.log(sql);
				tx.executeSql(sql, [], transCB);
			}
			
			var transCB = function(tx){
				thisObj.get_single(id,callback);
			}	
				
			this.WebSqlDB.transaction(tran);
		}
	},
	/*
	 * Function: delete_item
	 * Deletes an item from the database and removes it from the model's store
	 * 
	 * Parameters:
	 * id - {STRING} the id of the item that is being deleted
	 * callback - {FUNCTION} the function to be exicuted after the item has been deleted
	 */
	delete_item : function(id, callback){
		if(this.conType == 'LocS') {
			//LOCALSTORAGE
			var localStoreData = JSON.parse(localStorage[MCOR.appName+".MCOR."+this.modelName]);
			
			//TODO this should be handeled like an ajax request
			var found = null;
			if(this.pk != null){
				localStoreData.forEach(function(dataItem,index){
					if(dataItem[this.pk] == id){
						found = {index:index, item:dataItem};
					}
				}.bind(this));
			}
			if(found == null){
				callback({status:'not found'});
			} else {
				localStoreData.splice(found.index,1);
				this.remove_model_item(found.item[this.pk]);
			}
			localStorage[MCOR.appName+".MCOR."+this.modelName] = JSON.stringify(localStoreData);
			
		} else if(this.conType == 'RAPI'){
		
			new MCOR.Ajax.Request('api/delete_item/'+this.dbTable+'?id='+id,{
				method:'delete',
				onComplete: function(resp){
					this.remove_model_item(id);
					callback();
				}
			});
			
		} else if(this.conType == 'WebSQL')	{
			
			var sql = "DELETE FROM "+this.dbTable+" WHERE "+this.pk+" = '"+id+"'";
			var thisObj = this;
			
			var tran = function(tx){
				tx.executeSql(sql, [], transCB);
			}
			
			var transCB = function(tx){
				thisObj.remove_model_item(id);
				callback();
			}	
				
			this.WebSqlDB.transaction(tran);
		}
	},
	/*
	 * Function: set_single
	 * called once a get_single request has been completed. Unless used as a callback it would be best to use "apply_single"
	 * 
	 * Parameters:
	 * values - {OBJECT} the collection of key:value pairs that will be turned into a Model Item
	 * callback - {FUNCITON} The function exicuted once the modelItem has been createted
	 */
	
	set_single: function(values, callback){
		var modelItem = this.apply_single(values);
		if(callback instanceof Function){
			callback(modelItem);
		}
	},
	/*
	 * Function: set_list
	 * called once a get_ listrequest has been completed. Unless used as a callback it would be best to use "apply_list"
	 * 
	 * Parameters:
	 * values - {ARRAY} the list of collections of key:value pairs that will be turned into a Model Items
	 * callback - {FUNCITON} The function exicuted once the modelItem's have been  has been createted
	 */
	
	set_list: function(values, callback){
		var createdItems = this.apply_list(values);
		if(callback instanceof Function){
			callback(createdItems);
		}
	},
	/*
	 * Function: apply_single
	 * Creates a single ModelItem from the values object and adds it the Model's store
	 * 
	 * Parameters:
	 * values - {OBJECT} the key:value pair of items to be the content of the ModelItems content parameter
	 * callBack - {OBJECT} The object that defines the callback for the function 
	 * 				{
	 * 					callBack:{FUNCTION} //function to exicute once the model item has been added
	 * 					callBackOptions:{VARIABLE} // the options that will be the arguments of the callback
	 * 				}
	 * 
	 * Returns:
	 * {ModelItem} the newly created modelItem
	 */
	//TODO get rid of the callback. It is not needed
	apply_single : function(values,callBack){
		var parameters = {
			model:this
		};
		if(typeof callBack != 'object'){
			callBack = {};
		}
		var modelItem = new MCOR.ModelItem(values, parameters);
		if(callBack.hasOwnProperty('callback')){
			var cBO = {};
			if(callBack.hasOwnProperty('callBackOptions')){
				MCOR.Util.extend(cBO, callBack.callBackOptions)
			}
			callBack.callback(values, cBO);
		}
		return modelItem;
	},
	/*
	 * Function: apply_list
	 * Creates multiple ModelItmes From the values and adds them to the Model's store
	 * 
	 * Prameters: {Array of OBJECTS} The array of Objects that wil lbe added to the model's store
	 * 
	 * Returns:
	 * {ARRAY} the array of the newly created items
	 */
	
	apply_list : function(values){
		var modelItems = [];
		for(var i = 0; i<values.length; i++){
			//TODO do something here on error
			var modelItem = this.apply_single(values[i]);
			modelItems.push(modelItem);
		}
		return modelItems;
	},
	
	
	
	/*
	 * Function: add_model_items
	 * Adds an array of modelItems to the Model's store
	 * 
	 * Parameters:
	 * modelItems - {ARRAY} The array of Model Items
	 *    
	 * Returns:
	 * true if it completes
	 */
	
	//TODO make sure it is a real model item
	add_model_items : function(modelItems){
		for(var i = 0; i < modelItems.length; i++){
			modelItems[i].model = this;
			//the pk needs to be applied here..
			modelItems[i].id = modelItems[i].content[this.pk];
			var arrayItem = this.get_item_by_id(modelItems[i].id, true);
			if(arrayItem == null){
				this.store.content.push(modelItems[i]);
			} else {
				//TODO is this right?
				this.store.content[arrayItem.index] = modelItems[i];
			} 
		}
		return true;
	},
		
	/*
	 * Function: remove_model_item
	 * Removes an item from the Model's store if the id is found
	 * 
	 * Parameters: 
	 * id - {STRING} The id id the item to remove
	 * 
	 * Returns:
	 * true - If an item by that id was removed
	 * false - If an item was not removed
	 */
	
	remove_model_item : function(id){
		for(var i = 0; i < this.store.content.length; i++){
			if(this.store.content[i].id == id){
				this.store.content.splice(i,1);
				return true;
				break;
			}
		}
		return false;	
	},
	
	/*
	 * Function: get_item_by_id
	 * Retrieves an item from the model's store
	 * 
	 * Parameters:
	 * id - {STRING} The id that is being searched for
	 * returnIndex - {BOOL} If returnIndex is true the item is returned as an object. 
	 * 			The index number of the array is the value of the parameter 'index'
	 * 			The modelItemFound  is the value of the paremeter 'modelItem'
	 * 
	 *          	{	
	 * 					index:indexNumber,
	 * 					modelItem:theModelItemFound
	 *				}
	 * 
	 * Returns:
	 * modelItem {ModelItem} if found
	 * null {NULL} if not found
	 */
	
	get_item_by_id : function(id, rI){
		for(var i = 0; i < this.store.content.length; i++){
			if(this.store.content[i].id == id){
				if(rI == true){
					return {index : i, modelItem : this.store.content[i].id}
				} else {
					return this.store.content[i];
				}
				break;
			}
		}
		return null;
	}	
}