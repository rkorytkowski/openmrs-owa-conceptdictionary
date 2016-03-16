export default angular
	.module('ConceptDictionaryApp.conceptAdd', [])
	.controller('ConceptAddController', ConceptAddController)
	.name;

	ConceptAddController.$inject = ['serverLocales', 'loadClasses', 'loadDataTypes', '$scope'];
		
	function ConceptAddController(serverLocales, loadClasses, loadDataTypes, $scope){
		var vm = this;
		
		vm.serverLocales = serverLocales;
		vm.classes = loadClasses;
		vm.datatypes = loadDataTypes;
		
		vm.goLocale = goLocale;
		vm.selectedClass;
		vm.selectedDatatype;
		vm.isSet;
		vm.isNumeric;
		vm.isCoded;
		
		vm.checkType = checkType;
		
		activate();
		
		function activate(){
			
		}
		
		function goLocale(locale){
			
		};
		function checkType(){
			vm.isNumeric = (vm.selectedDatatype === "8d4a4488-c2cc-11de-8d13-0010c6dffd0f");
			vm.isCoded = (vm.selectedDatatype === "8d4a48b6-c2cc-11de-8d13-0010c6dffd0f");
		}
	}