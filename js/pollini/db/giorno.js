/*!
 * Tecnoteca srl - Arpav Pollini
 * http://www.tecnoteca.com
 */

Pollini.Giorno = {
	// table name
	TABLE_NAME: "Giorno",
	
	// columns
	COL_ID: "id",
	COL_PARTICELLA: "particella",
	COL_DATA: "data",
	COL_VALORE: "valore",
	COL_CONCENTRAZIONE: "concentrazione",
	COL_PREVISIONE: "previsione",
	COL_AVVISO: "avviso",
	
	// def
	tableDef: function() {
		var ns = Pollini.Giorno;
		var create = 'CREATE TABLE IF NOT EXISTS {0} ({1} INTEGER PRIMARY KEY, {2} INTEGER, {3} TEXT,{4} INTEGER, {5} TEXT, {6} TEXT, {7} TEXT, FOREIGN KEY({2}) REFERENCES {8}({9}))';
		return String.format(create, 
				ns.TABLE_NAME, 
				ns.COL_ID, 
				ns.COL_PARTICELLA, 
				ns.COL_DATA, 
				ns.COL_VALORE, 
				ns.COL_CONCENTRAZIONE,
				ns.COL_PREVISIONE,
				ns.COL_AVVISO,
				Pollini.Particella.TABLE_NAME,
				Pollini.Particella.COL_ID);
	},

	getAll: function(callback) {				
		var ns = Pollini.Giorno;
		Pollini.log(ns.TABLE_NAME + " getAll");
		var db = Pollini.DBService.getDB();
		Pollini.log(query);
		db.transaction(function (tx) {
			tx.executeSql('SELECT * FROM '+ns.TABLE_NAME, [], function(tx, results) {
					callback(results.rows);
				}, Pollini.DBService.errorCB);
    	});
	},

	getLast:function(stationId,callback) {
		var db = Pollini.DBService.getDB();
		var q="SELECT {0}.{1} as {12},{0}.{2},{3}.{4} as {5},{6}.* FROM {0},{3},{6} WHERE {3}.{7}={0}.{8} and {0}.{1}={6}.{9} and {3}.{7}={10} and {6}.{11} in (select max({6}.{11}) from {0},{6} where {6}.{9}={0}.{1} and {0}.{1}={12}) order by {6}.{11} desc ,{0}.{2}";
		var query = String.format(q,
								  Pollini.Particella.TABLE_NAME,
								  Pollini.Particella.COL_ID,
								  Pollini.Particella.COL_NOME,
								  Pollini.Stazione.TABLE_NAME,
								  Pollini.Stazione.COL_NOME,
								  Pollini.Stazione.ALIAS_NOME,
								  Pollini.Giorno.TABLE_NAME,
								  Pollini.Stazione.COL_ID,
								  Pollini.Particella.COL_STAZIONE,
								  Pollini.Giorno.COL_PARTICELLA,	
								  stationId,
								  Pollini.Giorno.COL_DATA,
								  Pollini.Particella.ALIAS_ID									  							  							  
								  );
		Pollini.log(query);
		db.transaction(function (tx) {
			tx.executeSql(query, [], function(tx, results) {							
					callback(results.rows);
				}, Pollini.DBService.errorCB);
		});		
		
	},
	
	getPrevious:function(id,day,callback) {
		Pollini.Giorno.getPreviousNext(id,day,false,callback);
	},
	
	getNext:function(id,day,callback) {
		Pollini.Giorno.getPreviousNext(id,day,true,callback);
	}, 

	getPreviousNext:function(id,day,next,callback) {
		var db = Pollini.DBService.getDB();
		var operator;
		var minmax;
		if (next) {
			operator='>';
			minmax='min';
		} else {
			operator='<';
			minmax='max';
		}
		var q="SELECT {0}.{1} as {12},{0}.{2},{3}.{4} as {5},{6}.* FROM {0},{3},{6} WHERE {3}.{7}={0}.{8} and {0}.{1}={6}.{9} and {3}.{7}={10} and {6}.{11} {14} '{13}' and {6}.{11} in (select {15}({6}.{11}) from {0},{6} where {6}.{9}={0}.{1} and {0}.{1}={12} and {6}.{11} {14} '{13}') order by {6}.{11} desc ,{0}.{2}";
		var query = String.format(q,
								  Pollini.Particella.TABLE_NAME,
								  Pollini.Particella.COL_ID,
								  Pollini.Particella.COL_NOME,
								  Pollini.Stazione.TABLE_NAME,
								  Pollini.Stazione.COL_NOME,
								  Pollini.Stazione.ALIAS_NOME,
								  Pollini.Giorno.TABLE_NAME,
								  Pollini.Stazione.COL_ID,	
								  Pollini.Particella.COL_STAZIONE,
								  Pollini.Giorno.COL_PARTICELLA,	
								  id,
								  Pollini.Giorno.COL_DATA,
								  Pollini.Particella.ALIAS_ID,
								  day,
								  operator,
								  minmax									  							  							  
								  );
		Pollini.log(query);
		db.transaction(function (tx) {
			tx.executeSql(query, [], function(tx, results) {							
					callback(results.rows);
				}, Pollini.DBService.errorCB);
		});		
		
	},

	getLastFavorites:function(stationId,stationName,callback) {
		var db = Pollini.DBService.getDB();
		var q="SELECT {0}.{1} as pid,{0}.{2},{3}.{4} as {5},{6}.* " +
				"FROM {0},{3},{6} " +
				"WHERE {3}.{7}={0}.{8} " +
				"and {0}.{1}={6}.{9} " +
				"and {3}.{7}={10} " +
				"and {6}.{11} in " +
				"(SELECT max({6}.{11}) " +
				"FROM {6} " +
				"WHERE {6}.{9}=pid) " +
				"and {0}.{12} in " +
				"(SELECT {13}.{14} " +
				"FROM {13} ) " +
				"ORDER BY {6}.{11} desc ,{0}.{2}";
		var query = String.format(q,
								  Pollini.Particella.TABLE_NAME,
								  Pollini.Particella.COL_ID,
								  Pollini.Particella.COL_NOME,
								  Pollini.Stazione.TABLE_NAME,
								  Pollini.Stazione.COL_NOME,
								  Pollini.Stazione.ALIAS_NOME,
								  Pollini.Giorno.TABLE_NAME,
								  Pollini.Stazione.COL_ID,	
								  Pollini.Particella.COL_STAZIONE,
								  Pollini.Giorno.COL_PARTICELLA,	
								  stationId,
								  Pollini.Giorno.COL_DATA,
								  Pollini.Particella.COL_CODICE,
								  Pollini.PreferenzaParticella.TABLE_NAME,									  
								  Pollini.PreferenzaParticella.COL_CODICE								  							  							  
								  );
		Pollini.log(query);
		db.transaction(function (tx) {
			tx.executeSql(query, [], function(tx, results) {							
					callback(results.rows, stationId, stationName);
				}, Pollini.DBService.errorCB);
		});		
		
	},
	
	getPreviousFavorites:function(id,day,callback) {
		Pollini.Giorno.getPreviousNextFavorites(id,day,false,callback);
	},
	
	getNextFavorites:function(id,day,callback) {
		Pollini.Giorno.getPreviousNextFavorites(id,day,true,callback);
	},

	getPreviousNextFavorites:function(id,day,next,callback) {
		var db = Pollini.DBService.getDB();
		var operator;
		var minmax;
		if (next) {
			operator='>';
			minmax='min';
		} else {
			operator='<';
			minmax='max';
		}
		var q="SELECT {0}.{1} as {12},{0}.{2},{3}.{4} as {5},{6}.* FROM {0},{3},{6} where {3}.{7}={0}.{8} and {0}.{1}={6}.{9} and {3}.{7}={10} and {6}.{11} {14} '{13}' and {6}.{11} in (select {15}({6}.{11}) from {0},{6} where {6}.{9}={0}.{1} and {0}.{1}={12} and {6}.{11} {14} '{13}') and {0}.{16} in (select {17}.{18} from {17}) order by {6}.{11} desc ,{0}.{2}";
		var query = String.format(q,
								  Pollini.Particella.TABLE_NAME,
								  Pollini.Particella.COL_ID,
								  Pollini.Particella.COL_NOME,
								  Pollini.Stazione.TABLE_NAME,
								  Pollini.Stazione.COL_NOME,
								  Pollini.Stazione.ALIAS_NOME,
								  Pollini.Giorno.TABLE_NAME,
								  Pollini.Stazione.COL_ID,	
								  Pollini.Particella.COL_STAZIONE,
								  Pollini.Giorno.COL_PARTICELLA,	
								  id,
								  Pollini.Giorno.COL_DATA,
								  Pollini.Particella.ALIAS_ID,
								  day,
								  operator,
								  minmax,
								  Pollini.Particella.COL_CODICE,
								  Pollini.PreferenzaParticella.TABLE_NAME,									  
								  Pollini.PreferenzaParticella.COL_CODICE	
								  );
		Pollini.log(query);
		db.transaction(function (tx) {
			tx.executeSql(query, [], function(tx, results) {							
					callback(results.rows);
				}, Pollini.DBService.errorCB);
		});
	},
		
	getInsertQueryHeader: function(id, particella, data, valore, concentrazione, previsione, avviso) {
		var ns = Pollini.Giorno;
		var q = 'INSERT INTO {0} SELECT {1} AS "{2}", {3} AS "{4}", "{5}" AS "{6}", {7} AS "{8}", "{9}" AS "{10}", "{11}" AS "{12}", "{13}" AS "{14}" ';
		var query = String.format(q,				
				ns.TABLE_NAME, 
				id,
				ns.COL_ID,
				particella,
				ns.COL_PARTICELLA,
				data,
				ns.COL_DATA,
				valore,
				ns.COL_VALORE,
				concentrazione,
				ns.COL_CONCENTRAZIONE,
				previsione,
				ns.COL_PREVISIONE,
				avviso,
				ns.COL_AVVISO);
		return query;
	},	
	
	getInsertQueryRow: function(id, particella, data, valore, concentrazione, previsione, avviso) {
		var q = 'UNION SELECT {0},{1},"{2}",{3},"{4}","{5}","{6}" ';
		var query = String.format(q, 				
				id, 
				particella, 
				data,
				valore,
				concentrazione,
				previsione,
				avviso);
		return query;
	},
	
};