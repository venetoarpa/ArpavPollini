/*!
 * Tecnoteca srl - Arpav Pollini
 * http://www.tecnoteca.com
 */

$(document).bind( "mobileinit", function() {
    $.mobile.allowCrossDomainPages = true;
    $.support.cors = true;
    $.mobile.loadingMessageTextVisible = true;
    $.mobile.ajaxEnabled = false;
    $.mobile.ignoreContentEnabled = true;
    $.mobile.pushStateEnabled = false;
});