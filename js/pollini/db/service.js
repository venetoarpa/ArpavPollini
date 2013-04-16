/*!
 * Tecnoteca srl - Arpav Pollini
 * http://www.tecnoteca.com
 */

Pollini.DBService = {
	
	getDB: function() {
		return openDatabase('ArpavPollini', '1.0', '', 2 * 1024 * 1024);
	}, 
	
	dropTables: function(callback) {
		Pollini.log("dropTables");
		var db = Pollini.DBService.getDB();
		db.transaction(function(tx) {
			Pollini.DBService.executeSql(tx, "DROP TABLE IF EXISTS " + Pollini.Stazione.TABLE_NAME);
			Pollini.DBService.executeSql(tx, "DROP TABLE IF EXISTS " + Pollini.Particella.TABLE_NAME);
			Pollini.DBService.executeSql(tx, "DROP TABLE IF EXISTS " + Pollini.Giorno.TABLE_NAME);
//			Pollini.executeSql(tx, "DROP TABLE IF EXISTS " + Pollini.PreferenzaStazione.TABLE_NAME);
//			Pollini.executeSql(tx, "DROP TABLE IF EXISTS " + Pollini.PreferenzaParticella.TABLE_NAME);
			Pollini.DBService.executeSql(tx, "DROP TABLE IF EXISTS " + Pollini.Configurazione.TABLE_NAME);
		}, Pollini.DBService.errorCB, callback);
	},
	
	initTables: function(callback) {
		Pollini.log("initTables");
		var db = Pollini.DBService.getDB();
		
		db.transaction(function(tx) {
			Pollini.DBService.executeSql(tx, Pollini.Stazione.tableDef());
			Pollini.DBService.executeSql(tx, Pollini.Particella.tableDef());
			Pollini.DBService.executeSql(tx, Pollini.Giorno.tableDef());
			Pollini.DBService.executeSql(tx, Pollini.PreferenzaStazione.tableDef());
			Pollini.DBService.executeSql(tx, Pollini.PreferenzaParticella.tableDef());
			Pollini.DBService.executeSql(tx, Pollini.Configurazione.tableDef());
		}, Pollini.DBService.errorCB, callback);
	},
	
	hasData: function(callback) {			
		var db = Pollini.DBService.getDB();
		var query = "SELECT name FROM sqlite_master WHERE type='table' AND name='"+Pollini.Configurazione.TABLE_NAME+"'";
		db.transaction(function (tx) {
			Pollini.log(query);
			tx.executeSql(query, [], function(tx, results) {
					if (results.rows.length > 0) {
						Pollini.Configurazione.get(Pollini.Configurazione.KEY_LASTUPDATE, function(row) {
							callback(row);
						});
					} else {
						callback(null);
					}
				}, Pollini.DBService.errorCB);
		});
	},
	
	errorCB: function (err) {
		Pollini.removeProc();
		var msg = "Error processing SQL: "+err.message + ", code: "+err.code;
		Pollini.log(msg);
	    alert(msg);
	},
	
	executeSql: function(tx, sql) {
		Pollini.log(sql);
		tx.executeSql(sql);
	},
		
};