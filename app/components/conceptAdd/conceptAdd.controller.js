/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at http://mozilla.org/MPL/2.0/. OpenMRS is also distributed under
 * the terms of the Healthcare Disclaimer located at http://openmrs.org/license.
 *
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */
import helpgif from '../../img/help.gif'

ConceptAddController.$inject = 
	['concept','serverLocales', 'loadClasses', 'loadDataTypes', 'conceptsService',
	'$location', '$routeParams', 'openmrsNotification', '$window'];
	
export default function ConceptAddController
		(concept, serverLocales, loadClasses, loadDataTypes, conceptsService,
		$location, $routeParams, openmrsNotification, $window){
	
	var vm = this;
	
    vm.links = {};
	vm.links["Concept.label"] = "";
    vm.links["Concept.manage"] = "concept/";
    
	//assign injected objects to this
	vm.serverLocales = serverLocales;
	vm.classes = loadClasses.results;
	vm.datatypes = loadDataTypes.results;
	
	vm.handlers = [ "UNIMPLEMENTED YET"];
	//flags and objects for view
	vm.isNumeric;
	vm.isCoded;
	vm.isComplex;
	vm.selectedLocale;
	//holds array of objects for each locale
	vm.localizedConcepts = {};
	//always points to one of localizedConcepts of selected locale
	vm.selectedLocaleData;
	//functions
	vm.goLocale = goLocale;
	vm.checkType = checkType;
	vm.pushSynonyms = pushSynonyms;
	vm.pushSearchTerms = pushSearchTerms;
	vm.deleteSynonym = deleteSynonym;
	vm.deleteSearchTerm = deleteSearchTerm;
	vm.postConcept = postConcept;
	vm.postConceptAndContinue = postConceptAndContinue;
	//on-update functions, receiving arrays of selected concepts
	vm.onSetMemberTableUpdate = onSetMemberTableUpdate;
	vm.onAnswerTableUpdate = onAnswerTableUpdate;
	vm.onFullnameUpdate = onFullnameUpdate;
	vm.onMappingsUpdate = onMappingsUpdate;
	vm.onEditCountUpdate = onEditCountUpdate;
	vm.editCount;
	//concept data to create post request
	vm.concept;
	vm.isFormValid = false;
	vm.editMode = false;
	vm.helpgif = helpgif;

	
	activate();
	
	function activate(){
		openmrsNotification.routeNotification();
		//edit mode
		if(angular.isDefined($routeParams.conceptUUID)){
			vm.concept = concept;
		    vm.isFormValid = true;
		    vm.editMode = true;
		    vm.links["Edit"] = "concept/edit/"+$routeParams.conceptUUID;
		} 
		//add mode
		else {
			vm.concept = conceptsService.getEmptyConceptObject();
			vm.concept.conceptClass = vm.classes[0];
			vm.concept.datatype = vm.datatypes[1];
			vm.concept.setMembers = [];
			vm.concept.answers = [];
		    vm.links["Add"] = "concept/add/";
		}
		createLocalized();
		vm.goLocale(serverLocales[0]);
		checkType();
	}
	
	function goLocale(locale){
		if(vm.selectedLocale !== locale){
			vm.selectedLocaleData = vm.localizedConcepts[locale];
			vm.selectedLocale = locale;	
		}
	};
	function checkType(){
		vm.isNumeric = (vm.concept.datatype.uuid === "8d4a4488-c2cc-11de-8d13-0010c6dffd0f");
		vm.isCoded = (vm.concept.datatype.uuid === "8d4a48b6-c2cc-11de-8d13-0010c6dffd0f");
		vm.isComplex = (vm.concept.datatype.uuid === "8d4a6242-c2cc-11de-8d13-0010c6dffd0f");
	}
	function createLocalized(){
		if(angular.isDefined($routeParams.conceptUUID)){
			vm.localizedConcepts = conceptsService.getLocalizedConcepts(vm.concept.names,
																		vm.concept.descriptions,
																		vm.serverLocales)
		}
		else{
			vm.localizedConcepts = conceptsService.getEmptyLocalizedConcepts(vm.serverLocales)
		}
	}
	function pushSynonyms(){
		vm.selectedLocaleData.synonyms.push({name : ''});
	}
	function deleteSynonym(synonym){
		var index = vm.selectedLocaleData.synonyms.indexOf(synonym);
		vm.selectedLocaleData.synonyms.splice(index, 1);
	}
	function pushSearchTerms(){
		vm.selectedLocaleData.searchTerms.push({name : ''});
	}
	function deleteSearchTerm(term){
		var index = vm.selectedLocaleData.searchTerms.indexOf(term);
		vm.selectedLocaleData.searchTerms.splice(index, 1);
	}
	
	function onSetMemberTableUpdate(concepts){
		updateArrayField(concepts, "setMembers")
	}
	function onAnswerTableUpdate(concepts){
		updateArrayField(concepts, "answers")
	}
	function onFullnameUpdate(isCorrect, name, suggestions){
		vm.selectedLocaleData.fullname.name = name;
		vm.selectedLocaleData.fullname.valid = isCorrect;
		validateForm()
	}
	function onMappingsUpdate(mappings){
	    updateArrayField(mappings, "mappings");
	}
	function onEditCountUpdate(count){
	    vm.editCount = count;
	}
	function updateArrayField(array, fieldName){
        vm.concept[fieldName] = [];
        for(var i=0;i<array.length;i++){
            vm.concept[fieldName].push(array[i]);
        }
	}
	function postConceptAndContinue(){
        post(function handleSuccess(result){
            if($location.path()==='/concept/add/'){
                $location.path('/concept/add/')
					.search({successToast : result.message, timestamp : Date.now()});
            } else {
				$location.path('/concept/edit/'+vm.concept.uuid)
					.search({successToast : result.message, timestamp : Date.now()});
			}
        })
	}
	function postConcept(){
	    post(function handleSuccess(result){
	        $location.path('/concept/').search({successToast : result.message});
	    })

	}

	function post(handleSuccess){
	    if(vm.editCount > 0){
            $window.alert("Please accept or discard Your changes in mapping table to save this concept");
        } else {
            conceptsService.postConcept(vm.concept, vm.localizedConcepts).then(function(result){
                if(angular.isDefined(result)&&result.success){
                   handleSuccess(result);
                }
                else{
                   openmrsNotification.error(result.message)
                }
            })
        }
	}
	function validateForm(){
		vm.isFormValid = false;
		for(var i=0;i<serverLocales.length; i++){
			if(vm.localizedConcepts[serverLocales[i]].fullname.valid){
				vm.isFormValid = true;
			} 
		}
	}

	/**
	 * Logic for openmrs-alert-dialog component
	 */
	vm.deleteForever = deleteForever;
	vm.showAlert = showAlert;
	vm.updateDeleteConfirmation = updateDeleteConfirmation;

	vm.deleteClicked = false;

	function deleteForever() {
		conceptsService.deleteConcept(vm.concept);
		$location.path('/concept').search({successToast: vm.concept.name.name+" has been deleted"});
	}
	function showAlert() {
		vm.message = "Are you sure that you want to delete " + vm.concept.name.name + " forever?";
		vm.deleteClicked = true;
	}
	function updateDeleteConfirmation(isConfirmed) {
		if (isConfirmed) {
			deleteForever();
		}
		vm.deleteClicked = false;
	}
};
