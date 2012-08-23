/**
 * Phonegap MailChimp API plugin
 * Copyright (c) SpaceKarst 2012
 */
var MailChimpAPI = function() {};

MailChimpAPI.prototype.subscribe = function(subscribeType, data, options, success, fail) {
	console.log("MailChimpApi called");
	return cordova.exec(function(args) {
			success(args);
		}, function(args) {
			fail(args);
		}, 'MailChimpAPI', subscribeType, [data, options]);
};

if(!window.plugins) {
    window.plugins = {};
}
if (!window.plugins.mailChimpAPI) {
    window.plugins.mailChimpAPI = new MailChimpAPI();
}
