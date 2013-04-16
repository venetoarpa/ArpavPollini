/*!
 * Tecnoteca srl - Arpav Pollini
 * http://www.tecnoteca.com
 */

Pollini = {
	ConnectionService: {
		isOnline: function () {
			var networkState = navigator.connection.type;
			return networkState!=Connection.UNKNOWN && networkState!=Connection.NONE;
		},
		checkConnection: function () {
			var networkState = navigator.connection.type;
			
			var states = {};
			states[Connection.UNKNOWN]  = 'Unknown connection';
			states[Connection.ETHERNET] = 'Ethernet connection';
			states[Connection.WIFI]     = 'WiFi connection';
			states[Connection.CELL_2G]  = 'Cell 2G connection';
			states[Connection.CELL_3G]  = 'Cell 3G connection';
			states[Connection.CELL_4G]  = 'Cell 4G connection';
			states[Connection.NONE]     = 'No network connection';
			
			alert('Connection type: ' + states[networkState]);
		}
	},
	log: function(message) {
		console.log("Pollini - " + message);
	},
	showLoadingMsg: function(message) {
		if (message==null)
			message = "Aggiornamento dati";
		$.mobile.showPageLoadingMsg("a", message);
	},
	hideLoadingMsg: function(){
		$.mobile.hidePageLoadingMsg();
	},
	urlParam: function(name){
	    var results = new RegExp('[\\?&amp;]' + name + '=([^&amp;#]*)').exec(window.location.href);
	    if (results){
	    	return results[1];
	    } else {
	    	return '';
	    };
	},
	addBanner: function() {
		var customBanner=$('#customBanner');
		if(Pollini.ConnectionService.isOnline())
			customBanner.attr("src", "http://www.arpa.veneto.it/app/images/banner_app_pollini_dx.png");
		else
			customBanner.attr("src", "img/banner_app_pollini_dx.png");
	},	
	procCount : 0,	
	addProc: function() {
		if (Pollini.procCount <= 0) {
			Pollini.procCount = 0;
			Pollini.showLoadingMsg();
		}			
		Pollini.procCount++;	
	},
	removeProc: function() {
		Pollini.procCount--;
		if (Pollini.procCount <= 0) {
			Pollini.procCount = 0;
			Pollini.hideLoadingMsg();
		}			
	},
	getCurrentTimestamp: function() {
		return Math.round(new Date().getTime() / 1000);
	},
	timeConverter: function(timestamp) {
		 var a = new Date(timestamp*1000);
	     var year = a.getFullYear();
	     var month = a.getMonth()+1;
	     var date = a.getDate();
	     var hour = a.getHours();
	     var min = a.getMinutes();
	     var sec = a.getSeconds();
	     var time = date+'/'+month+'/'+year+" "+hour+":"+min+":"+sec;
	     return time;
	},
	updateConnectionNote: function(lastUpdate) {
		var offlineNote = $("#offlineNote");
		if(Pollini.ConnectionService.isOnline())
			offlineNote.remove();
		else {
			offlineNote.addClass("visible");
			var lu = $("#lastUpdate");
			if(lastUpdate!=null) {
				// read from param
				lu.append(Pollini.timeConverter(lastUpdate));	
			} else {
				// read from db
				Pollini.Configurazione.get(Pollini.Configurazione.KEY_LASTUPDATE, function(row) {
					lastUpdate = row.valore;
					lu.append(Pollini.timeConverter(lastUpdate));
				});
			}
		}
	},
	checkExitButton: function() {
		if (device.platform == "Android") {
			var exitButton = $("#exitButton");
			exitButton.addClass("visible");	
		}
	},
	exitApp: function() {
		navigator.app.exitApp();
	},
	paramId: "id",
	paramDay: "day",
	paramDirection: "direction",
	paramAllStations: "allStations",
},

String.format = function() {
	var s = arguments[0];
	for ( var i = 0; i < arguments.length - 1; i++) {
		var reg = new RegExp("\\{" + i + "\\}", "gm");
		s = s.replace(reg, arguments[i + 1]);
	}
	return s;
};