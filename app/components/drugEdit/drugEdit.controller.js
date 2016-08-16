/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at http://mozilla.org/MPL/2.0/. OpenMRS is also distributed under
 * the terms of the Healthcare Disclaimer located at http://openmrs.org/license.
 *
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */

DrugEditController.$inject = 
	['$location', 'openmrsRest', 'loadDrug', 'openmrsNotification'];

export default function DrugEditController($location, openmrsRest, loadDrug, openmrsNotification){
	
	var vm = this;
	
    vm.links = {};
	vm.links["Concept.label"] = "";
    vm.links["ConceptDrug.manage"] = "drug/";
    vm.links["Add/Edit"] = "drug/"+loadDrug.uuid;

	vm.drug;
	vm.responseMessage;
	vm.isConceptCorrect = true;
	vm.isDosageCorrect = true;
	vm.isRouteCorrect = true;
	vm.showMessage;
	vm.Drug;
	vm.limitToClass = 'Drug';
	vm.membersOf = 'Route';
	
	//redirects to drug list after success
	vm.redirectToList = redirectToList;
	//saves the drug 
	vm.saveDrug = saveDrug;
	//update the drug concept with information from component
	vm.updateConcept = updateConcept;
	vm.updateDosageForm = updateDosageForm;
	vm.updateRoute = updateRoute;
	//activates the ctrl
	vm.activate = activate;
	//retire the drug
	vm.retire = retire;
	//unretire the drug
	vm.unRetire = unRetire;
	vm.isCorrect = isCorrect;
	
	vm.activate();
	
	
	function activate(){
		vm.drug = loadDrug;
		var isEditing = false;
		if(angular.isDefined(vm.drug.name)){
			isEditing = true;
			if(vm.drug.route === null){
				vm.drug.route = {
						display: ''
					};
			}
			if(vm.drug.dosageForm === null){
				vm.drug.dosageForm = {
						display: ''
					};
			}
			if (angular.isUndefined(vm.retireReason)) {
				vm.retireReason = "";
			}
        } else {
        	vm.drug.combination = false;
			vm.drug.concept = {
				display: ''
			};
			vm.drug.route = {
				display: ''
			};
			vm.drug.dosageForm = {
				display: ''
			};
		}
		if (!isEditing) {
			vm.isConceptCorrect = false;
		}
		vm.isCorrect();
	}
	
	function retire(){
		openmrsRest.remove('drug', vm.drug, vm.retireReason).then(handleSuccess, handleException);
	}
	
	function unRetire(){
		openmrsRest.unretire('drug', vm.drug).then(handleSuccess, handleException);
	}
	
	function isCorrect(){	
		return !(vm.isConceptCorrect && vm.isDosageCorrect && vm.isRouteCorrect && angular.isDefined(vm.drug.name));
	}
	
	function updateConcept(isCorrect, concept) {
	    vm.isConceptCorrect = isCorrect;
	    vm.drug.concept = concept;
	 };
	 function updateDosageForm(isCorrect, concept){
		 vm.isDosageCorrect = isCorrect;
		 vm.drug.dosageForm = concept;
	 };
	 function updateRoute(isCorrect, concept){
		 vm.isRouteCorrect = isCorrect;
		 vm.drug.route = concept;
	 };
	 
			
	function saveDrug(){
		vm.Drug = {
		  name: vm.drug.name,  
		  concept: vm.drug.concept.uuid,
		  combination: vm.drug.combination.toString(),
		  dosageForm: vm.drug.dosageForm.uuid,
		  strength: vm.drug.strength,
		  minimumDailyDose: vm.drug.minimumDailyDose,
		  maximumDailyDose: vm.drug.maximumDailyDose,
		  route: vm.drug.route.uuid,
		  retired: vm.drug.retired,
		  uuid: vm.drug.uuid
		};
		openmrsRest.update('drug', vm.Drug).then(handleSuccess, handleException);
	}
	
	function redirectToList(){
		$location.path('/drug');
	}
    function handleSuccess(success){
    	$location.path('/drug').search({successToast: vm.drug.name+" has been saved"});
    }
    function handleException(exception){
        openmrsNotification.error(exception.data.error.message);
    }

	/**
	 * Logic for openmrs-alert-dialog component
	 */
	vm.deleteForever = deleteForever;
	vm.showAlert = showAlert;
	vm.updateDeleteConfirmation = updateDeleteConfirmation;

	vm.deleteClicked = false;

	function deleteForever() {
		openmrsRest.purge('drug', vm.drug);
		$location.path('/drug').search({successToast: vm.drug.name+" has been deleted"});
	}
	function showAlert() {
		vm.message = "Are you sure that you want to delete " + vm.drug.name + " forever?";
		vm.deleteClicked = true;
	}
	function updateDeleteConfirmation(isConfirmed) {
		if (isConfirmed) {
			deleteForever();
		}
		vm.deleteClicked = false;
	}
	
};
