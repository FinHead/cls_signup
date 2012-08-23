var subscribers;
var tables = [];

var CREATE_TABLE_SUBSCRIBERS = 'CREATE TABLE IF NOT EXISTS SUBSCRIBERS (' +
	'EMAIL_ADDRESS VARCHAR(255) PRIMARY KEY NOT NULL, ' + 
	'FIRST_NAME VARCHAR(255) NOT NULL, ' +
	'LAST_NAME VARCHAR(255) NOT NULL, ' +
	'PREFERRED_FORMAT VARCHAR(255) NOT NULL' +
	');';

function table(dbName, tableName, createTableSQL, primaryKeys, columns, showLog){
    this.dbName = dbName;
    this.tableName = tableName;
    this.createTableSQL = createTableSQL;
    this.primaryKeys = primaryKeys;
    this.columns = columns;
	this.showLog = showLog;
	//alert("dbName="+dbName+" tableName="+tableName+" createSQL="+createTableSQL+" #keys="+primaryKeys.length+" #cols="+columns.length);
}

function initTables(){
        
	var dbName = "cls_signupdb.sqlite3";
     
    // SUBSCRIBERS
	var primaryKeys = ["EMAIL_ADDRESS"];
	var columns = ["EMAIL_ADDRESS","FIRST_NAME","LAST_NAME","PREFERRED_FORMAT"];
	subscribers = new table(dbName, "SUBSCRIBERS", CREATE_TABLE_SUBSCRIBERS, primaryKeys, columns, false);
	tables[tables.length++] = subscribers;
		
}

function dropAllTables(){
	for (i=0; i<tables.length; i++){
		storage.dropTable(tables[i]);
	}
	console.log("Dropped All the tables");
}

function createAllTables(){
	for (i=0; i<tables.length; i++){
		storage._getDB(tables[i]);
		storage.dbReady = false;
	}
	console.log("Created All the tables");
}

function cleanAllTables(){
	for (i=0; i<tables.length; i++){
		storage.clean(tables[i]);
	}
}