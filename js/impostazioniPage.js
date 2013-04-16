/*!
 * Tecnoteca srl - Arpav Pollini
 * http://www.tecnoteca.com
 */

(function() {
	
	var stazioniList = "#stazioniList";
	var particelleList = "#particelleList";
	
	Pollini.ImpostazioniPage = function() {
		bindEvents(this);
	};

	function bindEvents(me) {
		document.addEventListener('deviceready', function() {
			onDeviceReady(me);
		}, false);
	}
	
	function onDeviceReady(me) {
		Pollini.addProc();
		Pollini.addBanner();
		Pollini.checkExitButton();
		initStazioni();
		initParticelle();
		Pollini.removeProc();
		handleFormSubmit();
	}
	
	function initStazioni() {
		var prefix = "stazione";
		
		// add checkboxes
		Pollini.addProc();
		Pollini.Stazione.getAll(function(stazioni) {
			var column = $(stazioniList);
			for (var i=0; i<stazioni.length; i++) {				
				stazione = stazioni.item(i);
				
				var checkbox = "<input type='checkbox' name='{0}{1}' id='{0}{1}' value='{1}' /><label for='{0}{1}'>{2}</label>";
				var html = String.format(checkbox, prefix, stazione.id, stazione.nome);
				
				column.append(html);				
	        }
			column.trigger('create');			
			column.controlgroup("refresh");
			Pollini.removeProc();
		});
		
		// set checked
		Pollini.addProc();
		Pollini.PreferenzaStazione.getAll(function(stazioni) {
			for (var i=0; i<stazioni.length; i++) {
				stazione = stazioni.item(i);
				
				var id = String.format("#{0}{1}", prefix, stazione.id);
				var checkbox = $(id);
				checkbox.prop('checked', true);
				checkbox.checkboxradio("refresh");
			}
			Pollini.removeProc();
		});
	}
	
	function initParticelle() {
		var prefix = "particella";
		
		// add checkboxes
		Pollini.addProc();
		Pollini.Particella.getDistinct(function(particelle) {
			var column = $(particelleList);
			for (var i=0; i<particelle.length; i++) {				
				particella = particelle.item(i);
				var checkbox = "<input type='checkbox' name='{0}{1}' id='{0}{1}' value='{1}' /><label for='{0}{1}'>{2}</label>";
				var html = String.format(checkbox, prefix, particella.codice, particella.nome);
				
				column.append(html);				
	        }
			column.trigger('create');
			column.controlgroup("refresh");
			Pollini.removeProc();
		});
		
		// set checked
		Pollini.addProc();
		Pollini.PreferenzaParticella.getAll(function(particelle) {
			for (var i=0; i<particelle.length; i++) {
				particella = particelle.item(i);
				
				var id = String.format("#{0}{1}", prefix, particella.codice);
				var checkbox = $(id);
				checkbox.prop('checked', true);
				checkbox.checkboxradio("refresh");
			}
			Pollini.removeProc();
		});
	}
	
	function handleFormSubmit() {		
		var form = $('#target');
		form.submit(function() {
			Pollini.addProc();
			Pollini.PreferenzaStazione.deleteAll(function() {
				var stazioni = [];
				$(stazioniList + ' input:checked').each(function() {
					var stazione = $(this).attr('value');
					stazioni.push(stazione);
				});
				Pollini.PreferenzaStazione.insertAll(stazioni, function() {
					Pollini.PreferenzaParticella.deleteAll(function() {
						var particelle = [];
						$(particelleList + ' input:checked').each(function() {
							var particella = $(this).attr('value');
							particelle.push(particella);							
						});
						Pollini.PreferenzaParticella.insertAll(particelle, function() {
							Pollini.removeProc();
							$("#popupDialog").popup("open");
						});
					});
				});
			});
			return false;
		});	
	}

})();