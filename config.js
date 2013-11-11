var config = {};
//General
config.general = {
	url:'http://127.0.0.1:2102'
}

//Database
/* 
config.db = {
	adapter : 'pg',
	connection_info : 'postgres://postgres:5432@10.0.0.12/woi_manager'
}
*/
//Sample couchDB (nano is the adapter)

config.db = {
	adapter: 'nano',
	database_name:'posots',
	connection_info : 'http://127.0.0.1:5984/'
}

module.exports = config;
