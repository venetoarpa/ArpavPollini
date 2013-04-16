/*!
 * Tecnoteca srl - Arpav Pollini
 * http://www.tecnoteca.com
 */

Pollini.Stazione = {
	// table name
	TABLE_NAME: "Stazione",
	
	// columns
	COL_ID: "id",
	COL_CODICE: "codice",
	COL_NOME: "nome",
	ALIAS_NOME: "nomeStazione",
	
	// def
	tableDef: function() {
		var ns = Pollini.Stazione;
		var create = 'CREATE TABLE IF NOT EXISTS {0} ({1} INTEGER PRIMARY KEY, {2} TEXT,{3} TEXT)';						
		return String.format(create, ns.TABLE_NAME, ns.COL_ID, ns.COL_CODICE, ns.COL_NOME);
	},
	
	getAll: function(callback) {
		var ns = Pollini.Stazione;
		Pollini.log(ns.TABLE_NAME + " getAll");
		var db = Pollini.DBService.getDB();
		db.transaction(function (tx) {
			tx.executeSql('SELECT * FROM '+ns.TABLE_NAME +' ORDER BY ' + ns.COL_NOME, [], function(tx, results) {							
					callback(results.rows);
				}, Pollini.DBService.errorCB);
		});
	},
	
	getFavorites: function(callback) {
		var ns = Pollini.Stazione;
		Pollini.log(ns.TABLE_NAME + " getFavorites");
		var db = Pollini.DBService.getDB();
		var q="select * from {0} where {1} in (select {2} from {3}) order by {4}";
		var query = String.format(q,
 								  Pollini.Stazione.TABLE_NAME,
								  Pollini.Stazione.COL_ID,
								  Pollini.PreferenzaStazione.COL_ID,
								  Pollini.PreferenzaStazione.TABLE_NAME,
								  Pollini.Stazione.COL_NOME 
								  );
		db.transaction(function (tx) {
			tx.executeSql(query, [], function(tx, results) {							
					callback(results.rows);
				}, Pollini.DBService.errorCB);
		});
	},
	
	getInsertQueryHeader: function(id, codice, nome) {
		var ns = Pollini.Stazione;
		var q = 'INSERT INTO {0} SELECT {1} AS "{2}", "{3}" AS "{4}", "{5}" AS "{6}" ';
		var query = String.format(q,
				ns.TABLE_NAME, 
				id,
				ns.COL_ID,
				codice,
				ns.COL_CODICE,
				nome,
				ns.COL_NOME);
		return query;
	},	
	
	getInsertQueryRow: function(id, codice, nome) {
		var q = 'UNION SELECT {0},"{1}","{2}" ';
		var query = String.format(q, 				
				id,
				codice,
				nome);
		return query;
	},
		
};