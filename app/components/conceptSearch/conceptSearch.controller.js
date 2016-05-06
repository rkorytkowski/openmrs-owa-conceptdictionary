/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at http://mozilla.org/MPL/2.0/. OpenMRS is also distributed under
 * the terms of the Healthcare Disclaimer located at http://openmrs.org/license.
 *
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */

ConceptSearchController.$inject = ['$scope', '$routeParams' ,'openmrsRest', '$timeout'];			

export default function ConceptSearchController($scope, $routeParams, openmrsRest, $timeout) {

    var vm = this;
    
    vm.links = {};
    vm.links["Concept Dictionary"] = "";
    vm.links["Concept Dictionary Managment"] = "concept";

    //Default is undefined, but it could take data from URL if there is one
    vm.query;
    vm.enableDescription = false;

    //Tells if user is actually typing (which is described in timeoutRefresh() function
    vm.isUserTyping = false;

    //Default values
    vm.entriesPerPage = 5;
    vm.pageNumber = 1;
    vm.concepts='';

    //Boolean that represents state of loading more pages after downloading first page
    vm.loadingMorePages = false;

    //Page navigation
    vm.nextPage;
    vm.prevPage;
    vm.firstPage;
    vm.lastPage;

    //Page dividing
    vm.sliceFrom;
    vm.sliceTo;

    //Page range
    vm.viewRangeStart;
    vm.viewRangeEnd;

    // Method used to apply Rest response to controller variables and apply it on template
    vm.refreshResponse;

    //Method used to prevent app from querying server with every letter input into search query panel
    vm.timeoutRefresh;

    //Init method
    activate();

    //ng-show logic
    function isSearching () {
        return vm.isUserTyping && vm.query.length > 0
    }
    function isQueryFieldEmpty () {
        return vm.query.length == 0 && !vm.isUserTyping;
    }
    function conceptsNotFound () {
        return vm.query.length > 0 && vm.concepts.length == 0 && !vm.isUserTyping;
    }
    function showResults() {
        return vm.concepts.length > 0 && vm.query.length > 0 && !vm.isUserTyping;
    }
    function showEntriesCount() {
        return !vm.isUserTyping && vm.concepts.length && !vm.loadingMorePages;
    }
    function showResultInfoAndNavigationButtons () {
        return !vm.isUserTyping && vm.concepts.length > 0;
    }
    function isNextPagePossible () {
        return vm.viewRangeEnd() >= vm.concepts.length;
    }
    function isPrevPagePossible() {
        return vm.pageNumber == 1;
    }

    //Page navigation
    function nextPage () {
        vm.pageNumber++;
    }
    function prevPage () {
        vm.pageNumber--;
    }
    function firstPage () {
        vm.pageNumber = 1;
    }
    function lastPage () {
        vm.pageNumber = Math.floor(vm.concepts.length / vm.entriesPerPage) + 1;
    }

    //Page dividing
    function sliceFrom () {
        return vm.entriesPerPage*vm.pageNumber-vm.entriesPerPage;
    }
    function sliceTo () {
        return vm.entriesPerPage*vm.pageNumber;
    }

    //Page range
    function viewRangeStart () {
        return vm.sliceFrom()+1;
    }
    function viewRangeEnd () {
        return vm.sliceTo();
    }

    // Method used to prevent app from querying server with every letter input into search query panel
    var timeout = null;
    function timeoutRefresh()  {
        vm.isUserTyping = true;
        $timeout(function () {
        	vm.refreshResponse();
        	}, 250);
    }

    // Method used to apply Rest response to controller variables and apply it on template
    function refreshResponse() {
        firstPage();
        vm.isUserTyping = false;

        if (vm.query.length>0) {
            openmrsRest.listFull('concept', {q: vm.query, limit: vm.entriesPerPage, includeAll: true}).then(function (firstResponse) {
                vm.loadingMorePages = true;
                vm.concepts = firstResponse.results;

                openmrsRest.listFull('concept',{q: vm.query, includeAll: true}).then(function (response) {
                    vm.concepts = response.results;
                    vm.loadingMorePages = false;
                });
            });
        }
        else {
            $scope.$apply(function () {
                vm.concepts = '';
            })
        }
    }

    //Init method
    function activate(){
        if (angular.isDefined($routeParams.redirectQuery)) {
            vm.query = $routeParams.redirectQuery;
            refreshResponse();
        }
        else {
            vm.query = '';
        }

        vm.nextPage = nextPage;
        vm.prevPage = prevPage;
        vm.firstPage = firstPage;
        vm.lastPage = lastPage;
        vm.sliceFrom = sliceFrom;
        vm.sliceTo = sliceTo;
        vm.viewRangeStart = viewRangeStart;
        vm.viewRangeEnd = viewRangeEnd;
        vm.refreshResponse = refreshResponse;
        vm.timeoutRefresh = timeoutRefresh;

        //ng-show logic
        vm.isSearching = isSearching;
        vm.isQueryFieldEmpty = isQueryFieldEmpty;
        vm.conceptsNotFound = conceptsNotFound;
        vm.showResults = showResults;
        vm.showEntriesCount = showEntriesCount;
        vm.showResultInfoAndNavigationButtons = showResultInfoAndNavigationButtons;
        vm.isNextPagePossible = isNextPagePossible;
        vm.isPrevPagePossible = isPrevPagePossible;
    }
}
