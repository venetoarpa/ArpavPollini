/*!
 * Tecnoteca srl - Arpav Pollini
 * http://www.tecnoteca.com
 */

Pollini.PreferenzaParticella = {
	// table name
	TABLE_NAME: "PreferenzaParticella",
	
	// columns
	COL_CODICE: "codice",
	
	// def
	tableDef: function() {
		var ns = Pollini.PreferenzaParticella;
		var create = 'CREATE TABLE IF NOT EXISTS {0} ({1} INTEGER PRIMARY KEY)';
		return String.format(create, ns.TABLE_NAME, ns.COL_CODICE);
	},
	
	getAll: function(callback) {
		var ns = Pollini.PreferenzaParticella;
		Pollini.log(ns.TABLE_NAME + " getAll");
		var db = Pollini.DBService.getDB();
		db.transaction(function (tx) {
			tx.executeSql('SELECT * FROM '+ns.TABLE_NAME +' ORDER BY ' + ns.COL_CODICE, [], function(tx, results) {							
					callback(results.rows);
				}, Pollini.DBService.errorCB);
		});
	},
	
	insertAll: function(particelle, callback) {
		var db = Pollini.DBService.getDB();
		db.transaction(function(tx){
			var ns = Pollini.PreferenzaParticella;
			for (var i=0; i < particelle.length; i++) {
				codice = particelle[i];
				var q = 'INSERT INTO {0} ({1}) VALUES ("{2}")';
				var query = String.format(q, 
						ns.TABLE_NAME,  
						ns.COL_CODICE, 
						codice);
				Pollini.log(query);
				tx.executeSql(query);
			}
		}, Pollini.DBService.errorCB, callback);
	},
	
	deleteAll: function(callback) {
		var ns = Pollini.PreferenzaParticella;
		var db = Pollini.DBService.getDB();
		db.transaction(function (tx) {
			tx.executeSql('DELETE FROM '+ns.TABLE_NAME, [], function(tx, results) {
					callback();
				}, Pollini.DBService.errorCB);
		});
	},
		
};