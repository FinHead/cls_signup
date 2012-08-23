storage = {
    dbReady:false,

    _getDB:function(table){
        var db = new PGSQLitePlugin(table.dbName);

        if(!this.dbReady){
            var query = table.createTableSQL;
			//console.log(table.tableName+': Create = '+query);
			db.executeSql(query, function() {
				console.log(table.tableName+" Table Created!");
            }, function(err){
                console.log(table.tableName+": Error creating table! ", err);
            });
			
            this.dbReady = true;
        }
        
        return db;
    },

	clean:function(table){
		var query = ['DELETE FROM '+table.tableName+' WHERE 1 = 1;'];
		//console.log("clean query = "+query);
		this._getDB(table).executeSql(query, function() {
            console.log("Winner Winner Chicken Dinner!!");
        }, function(err){
            console.log(table.tableName+ ": Error cleaning records from table: ", err);
        });
	},

	set:function(table, values){
		var numCols = table.columns.length;
		var valuesSQL = 'VALUES(';
		for (i=0; i<numCols; i++){
			//if (table.showLog === true) console.log("Type of "+values[i]+": "+typeof(values[i]));
			if (typeof(values[i]) == "numeric") valuesSQL += values[i];
			else if (typeof(values[i]) == "string")	valuesSQL += "\'"+values[i]+"\'";
			if (i!=(numCols-1)) valuesSQL += ",";
		}
		valuesSQL += ')';
		var query = ['INSERT INTO '+table.tableName+' '+valuesSQL];
		console.log("Insert query="+query);
		this._getDB(table).executeSql(query, function() {
			//console.log("Success inserting "+table.columns[0] +" "+values[0]);
        }, function(err){
			console.log(table.tableName+": Error inserting: "+valuesSQL, err);
        });
	},

	/**
		This function is used to retrieve data from the database
		@param table table object to get data from.
		@param selectCols array of columns to return back; if empty array, then defaults to all.
		@param whereCols Associative Array of columns and values to search for.
		@param cb Callback function to return to.
	*/
	get:function(table, selectCols, whereCols, cb){
		var numSelectCols = selectCols.length;
		var selectSQL = '*';
		if (numSelectCols > 0){
			selectSQL = "";
			for (i=0; i<numSelectCols; i++){
				selectSQL += selectCols[i];
				if (i!=(numSelectCols-1)) selectSQL += ", ";
			}
		}
		var numWhereCols = whereCols.length;
		var whereSQL = ' WHERE ';
		var i=0;
		whereCols.each(function(k, v) {
			whereSQL += k+' = \''+v+'\'';
			if (i!=(numWhereCols-1)) whereSQL += " AND ";
			i++;	
		});
		var query = ['SELECT '+selectSQL+' FROM '+table.tableName];
		if (numWhereCols>0) query += whereSQL;
		//console.log(table.tableName+": Select="+query);	
		this._getDB(table).executeSql(query, cb, function(err){
			console.log("Error querying with query: "+selectSQL, err);
		});
	},
	
	/**
		This function is used to retrieve data using a 2 table join from the database
		@param table1 1st table object to get data from.
		@param selectCols1 array of columns from table 1 to return back; if empty array, then defaults to all.
		@param whereCols1 Associative Array of table 1 columns and values to search for.
		@param joinCols 2 column array, table 1 join column and table 2 join column.
		@param table2 2nd table object to get data from.
		@param selectCols2 array of columns from table 2 to return back; if empty array, then defaults to all.
		@param whereCols3 Associative Array of table 2 columns and values to search for.
		@param cb Callback function to return to.
	*/
	getJoin:function(table1, selectCols1, whereCols1, joinCols, table2, selectCols2, whereCols2, cb){
		var numSelectCols = selectCols1.length + selectCols2.length;
		var selectSQL = '*';
		if (numSelectCols > 0){
			selectSQL = "";
			for (i=0; i<numSelectCols; i++){
				if (i<selectCols1.length) selectSQL += "A."+selectCols1[i];
				else selectSQL += "B."+selectCols2[(i-selectCols1.length)];
				if (i!=(numSelectCols-1)) selectSQL += ", ";
			}
		}
		var numWhereCols = Object.keys(whereCols1).length + Object.keys(whereCols2).length;
		var whereSQL = " WHERE ";
		if (joinCols.length > 0) whereSQL += "A."+joinCols[0]+" = B."+joinCols[1];
		if (numWhereCols > 0) whereSQL += " AND ";
		var i=0;
		for (var col1 in whereCols1){
			// filter out the prototype definitions by testing the following while looping
			if (whereCols1.hasOwnProperty(col1)){
				whereSQL += "A."+col1+' = \''+whereCols1[col1]+'\'';
				if (i!=(numWhereCols-1)) whereSQL += " AND ";
				i++;
			}
		}
		for (var col2 in whereCols2){
			// filter out the prototype definitions by testing the following while looping
			if (whereCols2.hasOwnProperty(col2)){
				whereSQL += "B."+col2+' = \''+whereCols2[col2]+'\'';
				if (i!=(numWhereCols-1)) whereSQL += " AND ";
				i++;
			}
		}	
		var query = ['SELECT '+selectSQL+' FROM '+table1.tableName+' A, '+table2.tableName+' B '];
		query += whereSQL;
		//console.log(table1.tableName+": Select="+query);	
		this._getDB(table1).executeSql(query, cb, function(err){
			console.log("Error querying join query: "+selectSQL, err);
		});
	},
	
	/**
		This function is used to retrieve data using a 2 table left outer join from the database
		@param table1 1st table object to get data from.
		@param selectCols1 array of columns from table 1 to return back; if empty array, then defaults to all.
		@param whereCols1 Associative Array of table 1 columns and values to search for.
		@param joinCols 2 column array, table 1 join column and table 2 join column.
		@param table2 2nd table object to get data from.
		@param selectCols2 array of columns from table 2 to return back; if empty array, then defaults to all.
		@param whereCols3 Associative Array of table 2 columns and values to search for.
		@param cb Callback function to return to.
	*/
	getLeftOuterJoin:function(table1, selectCols1, whereCols1, joinCols, table2, selectCols2, whereCols2, cb){
		var numSelectCols = selectCols1.length + selectCols2.length;
		var selectSQL = '*';
		if (numSelectCols > 0){
			selectSQL = "";
			for (i=0; i<numSelectCols; i++){
				if (i<selectCols1.length) selectSQL += "A."+selectCols1[i];
				else selectSQL += "B."+selectCols2[(i-selectCols1.length)];
				if (i!=(numSelectCols-1)) selectSQL += ", ";
			}
		}
		var numWhereCols = Object.keys(whereCols1).length + Object.keys(whereCols2).length;
		var joinSQL = " ON ";
		var whereSQL = " WHERE ";
		if (joinCols.length > 0) joinSQL += "A."+joinCols[0]+" = B."+joinCols[1];
		//if (numWhereCols > 0) whereSQL += " AND ";
		var i=0;
		for (var col1 in whereCols1){
			// filter out the prototype definitions by testing the following while looping
			if (whereCols1.hasOwnProperty(col1)){
				whereSQL += "A."+col1+' = \''+whereCols1[col1]+'\'';
				if (i!=(numWhereCols-1)) whereSQL += " AND ";
				i++;
			}
		}
		for (var col2 in whereCols2){
			// filter out the prototype definitions by testing the following while looping
			if (whereCols2.hasOwnProperty(col2)){
				whereSQL += "B."+col2+' = \''+whereCols2[col2]+'\'';
				if (i!=(numWhereCols-1)) whereSQL += " AND ";
				i++;
			}
		}	
		var query = ['SELECT '+selectSQL+' FROM '+table1.tableName+' A LEFT JOIN '+table2.tableName+' B '];
		query += joinSQL + ' ' + whereSQL;
		console.log(table1.tableName+": Select="+query);	
		this._getDB(table1).executeSql(query, cb, function(err){
			console.log("Error querying left outer join query: "+selectSQL, err);
		});
	},
	
	getTx:function(table, selectCols, whereCols, transaction, cb){
		var numSelectCols = selectCols.length;
		var selectSQL = '*';
		if (numSelectCols > 0){
			selectSQL = "";
			for (i=0; i<numSelectCols; i++){
				selectSQL += selectCols[i];
				if (i!=(numSelectCols-1)) selectSQL += ", ";
			}
		}
		var numWhereCols = whereCols.length;
		var whereSQL = '';
		var i=0;
		whereCols.each(function(k, v) {
			whereSQL += k+' = \''+v+'\'';
			if (i!=(numWhereCols-1)) whereSQL += " AND ";
			i++;	
		});
        var query = ['SELECT '+selectSQL+' FROM '+table.tableName+' WHERE '+whereSQL];
		//console.log(table.tableName+": Select="+query);
		if (transaction === false){	
			this._getDB(table).executeSql(query, cb, function(err){
				console.log("Error querying with query: "+selectSQL, err);
			});
		}
		else {
			this._getDB(table).transaction(function(tx){
				tx.executeSql(query, cb, function(err){
					console.log("Error querying with transaction query: "+selectSQL, err);
				});
			}); 
		}
	},
	
	delete:function(table, values, cb){
		var numCols = table.primaryKeys.length;
		var whereSQL = 'WHERE ';
		for (i=0; i<numCols; i++){
			if (typeof(values[i]) == "number") whereSQL += table.primaryKeys[i]+" = "+values[i];
			else if (typeof(values[i]) == "string")	whereSQL += table.primaryKeys[i]+" = \'"+values[i]+"\'";
			if (i!=(numCols-1)) whereSQL += " AND ";
		}
		var query = ['DELETE FROM '+table.tableName+' '+whereSQL];
		console.log(table.tableName+": Delete="+query);	
		this._getDB(table).executeSql(query, cb, function(err){
			console.log(table.tableName+": Error deleting "+table.primaryKeys[0] +" "+values[0], err);
		});
	},

	dropTable:function(table){
		console.log("Dropping table: "+table.tableName);
		var db = new PGSQLitePlugin(table.dbName);
		var query = 'DROP TABLE IF EXISTS '+table.tableName;
		db.executeSql(query, function() {
			console.log(table.tableName+' Table Dropped!');
		}, function(err){
			console.log("Error dropping table: ", err);
		});	
	},
};