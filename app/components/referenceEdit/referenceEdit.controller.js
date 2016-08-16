/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at http://mozilla.org/MPL/2.0/. OpenMRS is also distributed under
 * the terms of the Healthcare Disclaimer located at http://openmrs.org/license.
 *
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */
ReferenceEditController.$inject = ['reference', 'sources', 'openmrsRest', '$location', 'openmrsNotification'];

export default function ReferenceEditController (reference, sources, openmrsRest, $location, openmrsNotification ){

    var vm = this;
    
    vm.links = {};
    vm.links["Concept.label"] = "";
    vm.links["ConceptReferenceTerm.manage"] = "reference/";
    vm.links["Add/Edit"] = "reference/"+reference.uuid;
    
    vm.save = save;
    vm.cancel = cancel;
    vm.retire = retire;
    vm.unretire = unretire;

    activate();

    function activate() {
        vm.reference = reference;
        vm.sources = sources.results;

        if(angular.isUndefined(vm.reference.uuid)){
            vm.reference.conceptSource = vm.sources[0]
        }
        if(angular.isUndefined(vm.retireReason)){
            vm.retireReason = "";
        }
        vm.reference.conceptSource = vm.reference.conceptSource;
        openmrsNotification.routeNotification();
    }

    function cancel () {
        $location.path('/reference');
    }

    function save() {
        openmrsRest.update('conceptreferenceterm', vm.reference).then(handleSuccess, handleException);
    }

    function unretire() {
        openmrsRest.unretire('conceptreferenceterm', vm.reference).then(handleSuccess, handleException);
    }

    function retire() {
        openmrsRest.retire('conceptreferenceterm', vm.reference, vm.retireReason).then(handleSuccess, handleException);
    }
    
    

    /**
     * Logic for openmrs-alert-dialog component
     */

    vm.deleteForever = deleteForever;
    vm.showAlert = showAlert;
    vm.updateDeleteConfirmation = updateDeleteConfirmation;
    
    vm.deleteClicked = false;
    
    function deleteForever() {
        openmrsRest.purge('conceptreferenceterm', vm.reference).then(
        	function(success)  {$location.path('/reference').search({successToast: vm.reference.code+" has been purged"});}, 
        	handleException);
    }
    function showAlert(item) {
        vm.message = "Are you sure that you want to delete " + vm.reference.code + " forever?";
        vm.deleteClicked = true;
    }
    function updateDeleteConfirmation(isConfirmed) {
        if (isConfirmed) {
            deleteForever();
        }
        vm.deleteClicked = false;
    }
    function handleSuccess(success){
    	$location.path('/reference').search({successToast: vm.reference.code+" has been saved"});
    }
    function handleException(exception){
        openmrsNotification.error(exception.data.error.message);
    }
}