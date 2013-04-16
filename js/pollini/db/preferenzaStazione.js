/*!
 * Tecnoteca srl - Arpav Pollini
 * http://www.tecnoteca.com
 */

Pollini.PreferenzaStazione = {
	// table name
	TABLE_NAME: "PreferenzaStazione",
	
	// columns
	COL_ID: "id",
	
	// def
	tableDef: function() {
		var ns = Pollini.PreferenzaStazione;
		var create = 'CREATE TABLE IF NOT EXISTS {0} ({1} TEXT PRIMARY KEY)';
		return String.format(create, ns.TABLE_NAME, ns.COL_ID);
	},
	
	getAll: function(callback) {
		var ns = Pollini.PreferenzaStazione;
		Pollini.log(ns.TABLE_NAME + " getAll");
		var db = Pollini.DBService.getDB();
		db.transaction(function (tx) {
			tx.executeSql('SELECT * FROM '+ns.TABLE_NAME +' ORDER BY ' + ns.COL_ID, [], function(tx, results) {							
					callback(results.rows);
				}, Pollini.DBService.errorCB);
		});
	},
	
	insertAll: function(stazioni, callback) {
		var db = Pollini.DBService.getDB();
		db.transaction(function(tx){
			var ns = Pollini.PreferenzaStazione;
			for (var i=0; i < stazioni.length; i++) {
				id = stazioni[i];
				var q = 'INSERT INTO {0} ({1}) VALUES ("{2}")';
				var query = String.format(q, 
						ns.TABLE_NAME,  
						ns.COL_ID, 
						id);
				Pollini.log(query);
				tx.executeSql(query);	
			}
		}, Pollini.DBService.errorCB, callback);			
	},
	
	deleteAll: function(callback) {
		var ns = Pollini.PreferenzaStazione;
		var db = Pollini.DBService.getDB();
		db.transaction(function (tx) {
			tx.executeSql('DELETE FROM '+ns.TABLE_NAME, [], function(tx, results) {
					callback();
				}, Pollini.DBService.errorCB);
		});
	},
		
};