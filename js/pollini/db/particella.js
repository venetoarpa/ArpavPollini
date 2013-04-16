/*!
 * Tecnoteca srl - Arpav Pollini
 * http://www.tecnoteca.com
 */

Pollini.Particella = {
	// table name
	TABLE_NAME: "Particella",
	
	// columns
	COL_ID: "id",
	COL_STAZIONE: "stazione",
	COL_CODICE: "codice",
	COL_NOME: "nome",
	ALIAS_ID: "pid",
	
	// def
	tableDef: function() {
		var ns = Pollini.Particella;
		var create = 'CREATE TABLE IF NOT EXISTS {0} ({1} INTEGER PRIMARY KEY, {2} INTEGER,{3} TEXT, {4} TEXT, FOREIGN KEY({2}) REFERENCES {5}({6}))';
		return String.format(create, 
				ns.TABLE_NAME, 
				ns.COL_ID, 
				ns.COL_STAZIONE, 
				ns.COL_CODICE, 
				ns.COL_NOME, 
				Pollini.Stazione.TABLE_NAME, 
				Pollini.Stazione.COL_ID);
	},

	getAll: function(callback) {				
		var ns = Pollini.Particella;		
		var db = Pollini.DBService.getDB();
		Pollini.log(ns.TABLE_NAME + " getAll");
		db.transaction(function (tx) {
			tx.executeSql('SELECT * FROM '+ns.TABLE_NAME, [], function(tx, results) {
					callback(results.rows);
				}, Pollini.DBService.errorCB);
    	});
	},
	
	getDistinct: function(callback) {				
		var ns = Pollini.Particella;		
		var db = Pollini.DBService.getDB();
		var query = String.format("SELECT distinct {0},{1} FROM {2} ORDER BY {1}",ns.COL_CODICE,ns.COL_NOME,ns.TABLE_NAME);
		Pollini.log(query);
		db.transaction(function (tx) {				
			tx.executeSql(query, [], function(tx, results) {
					callback(results.rows);
				}, Pollini.DBService.errorCB);
    	});
	},
	
	getInsertQueryHeader: function(id, stazione, codice, nome) {
		var ns = Pollini.Particella;
		var q = 'INSERT INTO {0} SELECT {1} AS "{2}", {3} AS "{4}", "{5}" AS "{6}", "{7}" AS "{8}" ';
		var query = String.format(q,				
				ns.TABLE_NAME, 
				id,
				ns.COL_ID,
				stazione,
				ns.COL_STAZIONE,
				codice,
				ns.COL_CODICE,
				nome,
				ns.COL_NOME);
		return query;
	},	
	
	getInsertQueryRow: function(id, stazione, codice, nome) {
		var q = 'UNION SELECT {0},{1},"{2}","{3}" ';
		var query = String.format(q, 				
				id, 
				stazione, 
				codice,
				nome);
		return query;
	},
	
};