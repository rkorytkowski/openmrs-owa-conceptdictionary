export default angular
	.module('ConceptDictionaryApp.conceptView', [])
	.controller('ConceptViewController', ConceptViewController)
	.name;

	//serverLocales = avalaible locales obtained from server
	ConceptViewController.$inject = ['$scope', 'concept', 'serverLocales', 'conceptLocaleService', '$location'];   

	function ConceptViewController ($scope, concept, serverLocales, conceptLocaleService, $location ){

		var vm = this;
		//determines if Numeric content is shown
		vm.isNumeric;
		//determines if coded answer content is shown
		vm.isCoded;
		//holds names and description of concept for currently selected locale
		vm.conceptLocale = {};
		//holds concept
		vm.concept = concept;
		//array of locales of concept
		vm.locales;
		//function invoked when user clicks locale button
		vm.goLocale = goLocale;
		//function invoked when user clicks other concept button
		vm.goTo = goTo;
		
		activate();
		
		//activation function
		function activate(){
			vm.locales = conceptLocaleService.getLocales(vm.concept.names,
					vm.concept.descriptions,
					serverLocales);
			
			checkType();
			goLocale(vm.concept.name.locale);
		}
		//inserts descriptions and names for specified locale into conceptLocale, parsed from concept tables,
		function goLocale (locale) {
			vm.conceptLocale.description 
				= conceptLocaleService.getLocaleDescr(vm.concept.descriptions, locale);
			vm.conceptLocale.names 
				= conceptLocaleService.getLocaleNames(vm.concept.names, locale);
		}
		//checks datatype of concept to determine
		function checkType (){
			vm.isNumeric = (vm.concept.datatype.display == "Numeric");
			vm.isCoded = (vm.concept.datatype.display == "Coded");
		}
		//
		function goTo (hash){
			$location.path(hash);
		}
	}