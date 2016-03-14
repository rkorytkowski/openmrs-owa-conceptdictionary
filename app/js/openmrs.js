/**
 * The pattern borrowed from https://gist.github.com/brucecoddington/92a8d4b92478573d0f42
 */
(function(){
	'use strict';
	
	angular
		.module('openmrs', [ 'ngResource' ])
		.factory('openmrsApi', openmrsApi)		
		.provider('openmrsRest', {list: list, get: get, $get: $get})		
	
		
	function openmrsApi($resource){
		var getOpenmrsContextPath = function() {
			var pathname = window.location.pathname; 
			return pathname.substring(0, pathname.indexOf("/owa/"));
		}

		var openmrsApi = {

			defaultConfig : {
				uuid : '@uuid'
			},

			extraMethods : {

			},

			add : function(config) {
				var params, url;

				// If the add() function is called with a
				// String, create the default configuration.
				if (angular.isString(config)) {
					var configObj = {
						resource : config,
						url : '/' + config
					};

					config = configObj;
				}

				// If the url follows the expected pattern, we can set cool
				// defaults
				if (!config.unnatural) {
					var orig = angular.copy(openmrsApi.defaultConfig);
					params = angular.extend(orig, config.params);
					url = getOpenmrsContextPath() + '/ws/rest/v1' + config.url + '/:uuid';

					// otherwise we have to declare the entire
					// configuration.
				} else {
					params = config.params;
					url = getOpenmrsContextPath() + '/ws/rest/v1' + config.url + '/:uuid';
				}

				// If we supply a method configuration, use that instead of
				// the default extra.
				var methods = config.methods || openmrsApi.extraMethods;

				openmrsApi[config.resource] = $resource(url, params, methods);
			}
		};

		return openmrsApi;
	};
	
	function list(resource, query) {
		return [ 'openmrsRest', function(openmrsRest) { // inject the data service
			return openmrsRest.list(resource, query);
	}]};

	function get(resource, query) {
		return [ 'openmrsRest', function(openmrsRest) {
			return openmrsRest.get(resource, query);
	}]};

	function $get(openmrsApi) {

		var openmrsRest = {

			list : function(resource, query) {
				openmrsApi.add(resource);
				return openmrsApi[resource].get(query).$promise.then(function(response){
					return response.results;
				});
			},

			listFull : function(resource, query) {
				openmrsApi.add(resource);
				if(query === undefined){
					query = {v: 'full'};
				}else{
					query = angular.extend(query, {v: 'full'});
				}
				return openmrsApi[resource].get(query).$promise.then(function(response){
					return response.results;
				});
			},
			listRef : function(resource, query) {
				openmrsApi.add(resource);
				if(query === undefined){
					query = {v: 'ref'};
				}else{
					query = angular.extend(query, {v: 'ref'});
				}
				return openmrsApi[resource].get(query).$promise.then(function(response){
					return response.results;
				});
			},

			get : function(resource, query) {
				openmrsApi.add(resource);
				return openmrsApi[resource].get(query).$promise;
			},

			getFull : function(resource, query) { 
				openmrsApi.add(resource);
				if(query === undefined){
					query = {v: 'full'};
				}else{
					query = angular.extend(query, {v: 'full'});
				}
				return openmrsApi[resource].get(query).$promise;
			},
			
			getRef : function(resource, query) { 
				openmrsApi.add(resource);
				if(query === undefined){
					query = {v: 'ref'};
				}else{
					query = angular.extend(query, {v: 'ref'});
				}
				return openmrsApi[resource].get(query).$promise;
			},

			create : function(resource, model) {
				openmrsApi.add(resource);
				return openmrsApi[resource].save(model).$promise;
			},

			update : function(resource, query, model) {
				openmrsApi.add(resource);
				return openmrsApi[resource].save(query, model).$promise;
			},

			remove : function(resource, query) {
				openmrsApi.add(resource);
				return  openmrsApi[resource].remove(query).$promise;
			}
		};

		return openmrsRest;
	};
	
})();