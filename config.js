var config = {};
//General
config.general = {
	url:'http://10.0.0.9:3000'
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
	connection_info : 'http://woi:w01W3b4pp@10.0.0.9:5984/'
}

module.exports = config;