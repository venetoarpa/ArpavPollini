/*!
 * Tecnoteca srl - Arpav Pollini
 * http://www.tecnoteca.com
 */

function showLevelsPopup(data,stazione,particella,concentrazione,previsione) {
	$('#levelsPopupTitle').text(particella);
	$('#levelsPopupCValue').text(concentrazione);
	if (previsione)
		$('#levelsPopupPValue').text(previsione);
	else
		$('#levelsPopupP').remove();
	$('#levelsPopup').popup("open");
}

(function() {
	
	var nextParam = 'next';
	var prevParam = 'prev';
	
	Pollini.StazionePage = function() {
		bindEvents();
	};

	function bindEvents() {
		document.addEventListener('deviceready', function() {
			onDeviceReady();
		}, false);
	}
	
	function onDeviceReady() {
		Pollini.addProc();
		Pollini.addBanner();
		Pollini.checkExitButton();
		Pollini.updateConnectionNote();
		var day = Pollini.urlParam(Pollini.paramDay);
		var stationId = Pollini.urlParam(Pollini.paramId);
		var direction = Pollini.urlParam(Pollini.paramDirection);
		queryByDay(direction, stationId, day, updateUI);
	}
	
	function queryByDay(direction, stationId, day, callback) {
		var allStations = Pollini.urlParam(Pollini.paramAllStations);
		if(day) {
			Pollini.PreferenzaParticella.getAll(function(results) {
				var next = direction==nextParam;
				if(results.length>0 && !allStations) {
					if (next)
						Pollini.Giorno.getNextFavorites(stationId,day,callback);
					else
						Pollini.Giorno.getPreviousFavorites(stationId,day,callback);
				} else {
					if (next)
						Pollini.Giorno.getNext(stationId,day,callback);
					else
						Pollini.Giorno.getPrevious(stationId,day,callback);
				} 
			});
		} else {
			// last day available
			Pollini.PreferenzaParticella.getAll(function(results) {
				if(results.length>0 && !allStations) {
					Pollini.Giorno.getLastFavorites(stationId,null,callback);
				} else {
					Pollini.Giorno.getLast(stationId,callback);
				} 
			});
		}
	}
		
	
	function updateUI(rilievi) {
		var firstObj=rilievi.item(0);
		var firstObjName=firstObj.nomeStazione;
		var day=firstObj.data;
		var stationId = Pollini.urlParam(Pollini.paramId);
					
		// set title
		var title=$('#titleBar');
		title.append($('<span>', {'text':firstObjName}));
		
		// set nav bar
		var hasNext=false;
		var hasPrev=false;
		queryByDay(nextParam, stationId, day, function(results) {
			if(results.length>0)
				hasNext=true;
			queryByDay(prevParam, stationId, day, function(results) {
				if(results.length>0)
					hasPrev=true;
				updateNavBar(hasNext, hasPrev, day, stationId);
				
				// show data
				var ul = $('#rilievi');		
				for (var i=0; i<rilievi.length; i++) {
					rilievo = rilievi.item(i);
					
					var clearDiv = $('<div>', {'class': 'clearBoth'});
					var concentrazioneDiv = $('<div>', {'text': '','class': (rilievo.concentrazione ? 'level '+rilievo.concentrazione : 'level ND'),});
					var previsioneDiv = $('<div>', {'text': '','class': (rilievo.previsione ? 'prevision '+rilievo.previsione+'T' : 'level ND'),});
					var nomeDiv = $('<div>', {'text':rilievo.nome,'class': 'customRowText'});
					
					var li = $('<li>', {"data-icon":"false"});
					var showPopup = String.format('showLevelsPopup("{0}","{1}","{2}","{3}","{4}"); return false', 
							day, 
							rilievo.nomeStazione, 
							rilievo.nome, 
							rilievo.concentrazione, 
							rilievo.previsione);
					var a = $('<a>', {'href':'#', 'onClick' : showPopup });
					a.append(nomeDiv);
					if(!hasNext)
						a.append(previsioneDiv);
					a.append(concentrazioneDiv);
					a.append(clearDiv);
					li.append(a);
					ul.append(li);
				}
				ul.listview('refresh');
				
				Pollini.removeProc(); // started on ondeviceready
			});
		});

	}
	
	function updateNavBar(hasNext, hasPrev, day, stationId) {
		var navBar=$('#navBar');
		
		var succ = $('<a>', {'class':( hasNext ? '' : 'ui-disabled'),
						'text': 'Succ',
						'data-theme':'b',
						'data-role':'button',
						'data-icon':'arrow-r',
						'data-iconpos':'right',
						'href': getLink(stationId, day, nextParam), });
		
		var date = $('<a>', {'text': day,
						'data-theme':'b',
						'data-role':'button'});
		
		var prec = $('<a>', {'class':( hasPrev ? '' : 'ui-disabled'),
						'text': 'Prec',
						'data-theme':'b',
						'data-role':'button',
						'data-icon':'arrow-l',
						'data-iconpos':'left',
						'href': getLink(stationId, day, prevParam), });
		
		navBar.append(prec).append(date).append(succ);
		navBar.trigger('create');
		navBar.controlgroup("refresh");
	}
	
	function getLink(stationId, day, direction) {
		return String.format('stazione.html?{0}={1}&{2}={3}&{4}={5}&{6}={7}', 
				Pollini.paramId, 
				stationId,
				Pollini.paramDay,
				day,
				Pollini.paramDirection,
				direction,
				Pollini.paramAllStations,
				Pollini.urlParam(Pollini.paramAllStations));
	}
	
})();