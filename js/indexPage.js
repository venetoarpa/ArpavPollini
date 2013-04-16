/*!
 * Tecnoteca srl - Arpav Pollini
 * http://www.tecnoteca.com
 */

(function() {
	
	var idStazione = 0;
	var idParticella = 0;
	var idGiorno = 0;
	var stazioniInsertQuery = "";
	var particelleInsertQuery = "";
	var giorniInsertQuery = "";
    var refreshInterval= 600; // 10 min.

	Pollini.IndexPage = function() {
		bindEvents();
	};

	// private methods
	function bindEvents() {
		document.addEventListener('deviceready', function() {
			onDeviceReady();
		}, false);
	}
		
	function onDeviceReady() {
		Pollini.addProc();
		Pollini.addBanner();
		Pollini.checkExitButton();
		Pollini.DBService.hasData(function(lastUpdateDB) {
			if(lastUpdateDB!=null) {				
				var lastUpdate = lastUpdateDB.valore;
				Pollini.updateConnectionNote(lastUpdate);
				if(Pollini.ConnectionService.isOnline()) {
					var now = Pollini.getCurrentTimestamp();
					if ((now - lastUpdate) > refreshInterval)
						initXML();
					else
						updateUI();
				} else {
					updateUI();
				}				
			} else {
				if(Pollini.ConnectionService.isOnline()) {
					initXML();
				} else {
					$.mobile.changePage('connessione.html', 'pop', true, true);
				}
			}
		});
	}
	
	function insertAll() {
		var db = Pollini.DBService.getDB();			
		db.transaction(function (tx) {
			tx.executeSql(stazioniInsertQuery, [], function(tx, results) {
				db.transaction(function (tx) {
					tx.executeSql(particelleInsertQuery, [], function(tx, results) {
						db.transaction(function (tx) {
							tx.executeSql(giorniInsertQuery, [], function(tx, results) {
									db.transaction(function (tx) {
										Pollini.Configurazione.insert(Pollini.Configurazione.KEY_LASTUPDATE,Pollini.getCurrentTimestamp());
										updateUI();
									});											
							}, Pollini.DBService.errorCB);
						});
					}, Pollini.DBService.errorCB);
				});
			}, Pollini.DBService.errorCB);
		});
	}
	
	function updateUI() {
		if (Pollini.urlParam(Pollini.paramAllStations)) {
			Pollini.Stazione.getAll(updateStazioniUI);
		} else {
			Pollini.Stazione.getFavorites(function(results) {
				if(results.length>0) {
					addAllButton();
					updateStazioniUI(results, true);				
				} else {
					addPrefHint();
					Pollini.Stazione.getAll(updateStazioniUI);	
				}
			});			
		}
	}	
	
	function addAllButton() {
		var topAll = $("#topAll");
		topAll.addClass("visible");
	}	

	function addPrefHint() {
		// remove standard pref button
		var topRef = $("#topPref");
		topRef.remove();
		
		// add hint
		var hint = $("#hint");
		hint.append($("#hintContent").html());
		hint.trigger("create");
	}

	function updateStazioniUI(stazioni, favoriteStations) {
		for (var i=0; i<stazioni.length; i++) {
			Pollini.addProc();
			stazione = stazioni.item(i);
			var a = "";
			var normalLinkTag = "<a href='{0}'><h2>{1}</h2></a>";
			if(favoriteStations) {
				Pollini.Giorno.getLastFavorites(stazione.id, stazione.nome, function(results, stationId, stationName) {
					if (results.length>0) {
						var alerts = "";
						for(var i=0; i<results.length; i++) {
							row = results.item(i);
							if(row.avviso != "") {
								alerts += "<b>"+row.nome+"</b>: ";
								alerts += row.avviso;
								alerts += "<br/>";
							}
						}
						if (alerts!="") {
							var extendedLinkTag = "<a href='{0}'><h2>{1}</h2><p class='highlight'>{2}</p></a>";
							a = String.format(extendedLinkTag, getLink(stationId), stationName, alerts);
						} else {
							a = String.format(normalLinkTag, getLink(stationId), stationName);	
						}
					} else {
						a = String.format(normalLinkTag, getLink(stationId), stationName);
					}
					appendEntryUI(a);
					Pollini.removeProc();					
				});
			} else {
				a = String.format(normalLinkTag, getLink(stazione.id), stazione.nome);
				appendEntryUI(a);
				Pollini.removeProc();
			}
			
			Pollini.removeProc(); // ondeviceready
        }
	}
	
	function getLink(id) {
		return String.format('stazione.html?{0}={1}&{2}={3}', 
				Pollini.paramId, 
				id, 
				Pollini.paramAllStations, 
				Pollini.urlParam(Pollini.paramAllStations));
	}
	
	function appendEntryUI(a) {
		var ul = $('#stazioniListView');
		var li = $('<li/>', {});
		li.append(a);
		ul.append(li);
		ul.listview('refresh');
	}
	

	function initXML() {
		Pollini.log("************** Reload XML data **************");
		$.ajax({
			beforeSend: function() { Pollini.addProc(); }, //Show spinner
            complete: function() { Pollini.removeProc(); }, //Hide spinner
    	    type: "GET",
    	    url: "http://www.arpa.veneto.it/xmlfiles/pollini.xml",
    	    dataType: "xml",    	    
    	    success: function(xml) {
    	    	Pollini.DBService.dropTables(function() {
    	    		Pollini.DBService.initTables(function() {
    	    			initStazioni($(xml));
    	    			insertAll();
    	    		});    	    		
    	    	});	    	    
    	    },
    	    error: function (jqXHR, textStatus, errorThrown ) {    	     	
    	    	Pollini.removeProc();
    	    	Pollini.log(jqXHR);
    	    	Pollini.log(textStatus);
    	    	Pollini.log(errorThrown);
    	    	alert("Errore di connessione al Server");
    	    	$.mobile.changePage("info.html");
    	    },
    	});
	}
	
	function initStazioni(xml) {		
		xml.find('STAZIONE').each(function() {
			idStazione++;
	    	stazioneXml = $(this);
	    	codStazione = stazioneXml.attr('cod_stazione');
	    	nomeStazione = stazioneXml.attr('nome_stazione');
	    		    	
	    	if(idStazione==1)
	    		stazioniInsertQuery += Pollini.Stazione.getInsertQueryHeader(idStazione, codStazione, nomeStazione);
			else
				stazioniInsertQuery += Pollini.Stazione.getInsertQueryRow(idStazione, codStazione, nomeStazione);
	    		    	
	    	initParticelle(stazioneXml, idStazione);
	    });
	}
	
	function initParticelle(stazioneXml, idStazione) {
		stazioneXml.find('PARTICELLA').each(function() {
			idParticella++;
			particellaXml = $(this);
    		codPart = particellaXml.attr('cod_part');
	    	nomePart = particellaXml.attr('nome_part');
	    	
	    	if(idParticella==1)
	    		particelleInsertQuery += Pollini.Particella.getInsertQueryHeader(idParticella, idStazione, codPart, nomePart);
			else
				particelleInsertQuery += Pollini.Particella.getInsertQueryRow(idParticella, idStazione, codPart, nomePart);
	    	
	    	initGiorni(particellaXml, idParticella);
    	});
	}
	
	function initGiorni(particellaXml, idParticella) {
		particellaXml.find('GIORNO').each(function() {
			idGiorno++;
			giornoXml = $(this);
			data = giornoXml.attr('data');
			valore = giornoXml.attr('valore');
			concentrazione = giornoXml.attr('concentrazione');
			
			previsione = "";
			var prevXml = giornoXml.attr('previsione');
			if(prevXml!=null)
				previsione = prevXml;
			
			avviso = "";
			var avvXml = giornoXml.attr('avviso');			
			if(avvXml!=null)
				avviso = avvXml;
			
			if(idGiorno==1)
				giorniInsertQuery += Pollini.Giorno.getInsertQueryHeader(idGiorno, idParticella, data, valore, concentrazione, previsione, avviso);
			else
				giorniInsertQuery += Pollini.Giorno.getInsertQueryRow(idGiorno, idParticella, data, valore, concentrazione, previsione, avviso);
		});
	}

})();