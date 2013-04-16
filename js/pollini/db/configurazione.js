/*!
 * Tecnoteca srl - Arpav Pollini
 * http://www.tecnoteca.com
 */

Pollini.Configurazione = {
	// table name
	TABLE_NAME: "Configurazione",
	
	// columns
	COL_CHIAVE: "chiave",
	COL_VALORE: "valore",
	
	// keys
	KEY_LASTUPDATE: "ultimo aggiornamento",
	
	// def
	tableDef: function() {
		var ns = Pollini.Configurazione;
		var create = 'CREATE TABLE IF NOT EXISTS {0} ({1} TEXT PRIMARY KEY, {2} TEXT)';
		return String.format(create, ns.TABLE_NAME, ns.COL_CHIAVE, ns.COL_VALORE);
	},
	
	get: function(chiave, callback) {
		var ns = Pollini.Configurazione;
		var db = Pollini.DBService.getDB();
		db.transaction(function (tx) {
			var q = 'SELECT * FROM {0} WHERE {1}="{2}"';
			var query = String.format(q, ns.TABLE_NAME, ns.COL_CHIAVE, chiave);
			Pollini.log(query);
			tx.executeSql(query, [], function(tx, results) {
					var row = null;
					if (results.rows.length>0)
						row = results.rows.item(0);
					callback(row);
				}, Pollini.DBService.errorCB);
		});
	},
	
	insert: function(chiave, valore) {
		var ns = Pollini.Configurazione;
		var db = Pollini.DBService.getDB();
		db.transaction(function (tx) {
			var q = 'INSERT INTO {0} ("{1}","{2}") VALUES ("{3}","{4}")';
			var query = String.format(q, 
					ns.TABLE_NAME,  
					ns.COL_CHIAVE,
					ns.COL_VALORE,
					chiave,
					valore);
			Pollini.log(query);
			tx.executeSql(query, [], null, Pollini.DBService.errorCB);
		});
	},
		
};