/*!
 * Tecnoteca srl - Arpav Pollini
 * http://www.tecnoteca.com
 */

(function() {
	Pollini.InfoPage = function() {
		bindEvents();
	};

	// private methods
	function bindEvents() {
		document.addEventListener('deviceready', function() {
			onDeviceReady();
		}, false);
	}
	
	function onDeviceReady(me) {
		Pollini.addBanner();
		
		$('.polliniLink').live('tap', function() {
		    url = $(this).attr("rel");
		    loadURL(url);
		});		
	}
	
	function loadURL(url){
		window.open(url, "_system");
		return false;
	}
	
})();