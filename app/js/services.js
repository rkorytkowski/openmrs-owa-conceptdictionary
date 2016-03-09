var conceptDictServices = angular.module('conceptDictServices', ['ngResource']);

conceptDictServices
.factory('Util', [function(){
	return {
		/**
		 * @returns string server url
		 */
		getOpenmrsContextPath: function(){
			var pathname = window.location.pathname;
			return pathname.substring(0, pathname.indexOf("/owa/"));
		}
	}
}])
.factory('Classes',['$resource', 'Util', function($resource, Util){
	return $resource(
			Util.getOpenmrsContextPath() + '/ws/rest/v1/conceptclass/:uuid?:mode', {},
			//Returns all classes as results object
				{getAll: {method:'GET', params:{mode : 'v=full'}, isArray:false},
			//Returns single class
				 getClass: {method: 'GET', params:{mode: 'v=full'}, isArray:false },
			//deletes class with specified uuid
				 deleteClass: {method: 'DELETE'},
			//Adds new class
				 addClass: {method: 'POST', isArray:false},
			//Edit existing class
				 editClass: {method: 'POST', isArray:false}});
}])
.factory('ClassesService', ['Classes', function(Classes){
   return{
	   /**
	    * unwraps results object
	    * @returns array of concept class objects
	    */
	   getAll: function(){
		   return Classes.getAll().$promise.then(function(response){
			   return response.results;
		   });
	   },
	   /**
	    * fetches single concept class
	    * @param uuid the uuid of concept class which will be fetched
	    * @returns concept class object
	    */
	   getClass: function(uuid){
		   return Classes.getClass(uuid);
	   },
	   //wraps Classes.getClass function
	   deleteClass: function(uuid){
		   return Classes.deleteClass(uuid);
	   },
	   addClass: function(newClass){
		   return Classes.addClass(newClass).$promise;
	   },
	   editClass: function(uuid, editedClass){
		   return Classes.editClass({uuid: uuid}, editedClass).$promise;
	   }
   }
}])
.factory('DataTypes', ['$resource', 'Util', function($resource, Util){
	return $resource(
			Util.getOpenmrsContextPath() + '/ws/rest/v1/customdatatype/:uuid?:mode', {},
			//Returns all datatypes as results object
				{getAll: {method:'GET', params:{mode : 'v=full'}, isArray:false},
			//Returns single datatype
				 getDataType: {method: 'GET', params:{mode: 'v=full'}, isArray:false }});
}])
.factory('DataTypesService', ['DataTypes', function(DataTypes){
	   return{
		   /**
		    * unwraps results object
		    * @returns array of datatypes class objects
		    */
		   getAll: function(){
			   return DataTypes.getAll().$promise.then(function(response){
				   return response.results;
			   });
		   },
		   /**
		    * fetches single datatype
		    * @param uuid the uuid of datatype which will be fetched
		    * @returns datatype object
		    */
		   getDataType: function(uuid){
			   return DataTypes.getDataType(uuid);
		   }
	   }
}])
.factory('Concepts',['$resource', 'Util', function($resource, Util){
   	return $resource(
   			Util.getOpenmrsContextPath()+'/ws/rest/v1/concept/:uuid?:mode', {}, 
   			//Returns single concept
   				 {getConcept: {method: 'GET', params:{mode : 'v=full'}, isArray:false }});
   			//deletes class with specified uuid
}])
.factory('ConceptsService',['Concepts', function(Concepts){
   	return{
   			//Returns single concept
   		getConcept: function(uuid){
   			return Concepts.getConcept(uuid);
   		}}
}])
.factory('ConceptLocaleService',[function(){
	return{
		/**
		 * @names array of names objects of concept
		 * @locale string of locale abbreviation, e.g. "en"
		 * @returns object, which holds full, short name and synonyms for specified locale
		 */
		getLocaleNames: function(names, locale){
			//flags for types of locale prefered names
			const shortFlag = "SHORT";
			const fullFlag = "FULLY_SPECIFIED";
			//holds full, short names and synonyms array
			var localNames = {};
			localNames.synonyms = [];
			
			for (let name of names){
				if(name.locale == locale){
					if(name.conceptNameType == shortFlag) localNames.short = name.display;
					if(name.conceptNameType == fullFlag) localNames.full = name.display;
					else localNames.synonyms.push(name.display);
				}
			}
			return localNames;
		},
		/**
		 * @descriptions array of descriptions objects of concept
		 * @locale string of locale abbreviation
		 * @returns string - description of concept for given locale
		 */
		getLocaleDescr: function(descriptions, locale){
			for (let descr of descriptions){
				if(descr.locale == locale){
					return descr.display;
				}
			}
		}
	}
}])
