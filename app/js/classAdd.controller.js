export default angular
    .module('ConceptDictionaryApp.classAdd', [])
    .controller('ClassAdd', ['$location', 'openmrsRest',
    function($location, openmrsRest){

        var vm = this;

        //Default values for class and response message
        vm.class = {
            name:'',
            description:''
        };
        vm.responseMessage = '';

        //Method used to add class with current class params
        vm.addClass = addClass;

        //Method used to cancel class making
        vm.cancel = cancel;


        //Method used to add class with current class params
        function addClass() {
            vm.json = angular.toJson(vm.class);
            openmrsRest.create('conceptclass', vm.json).then(function(success) {
                //Fix this
                vm.success = true;
                $location.path('/class-list').search({classAdded: vm.class.name});
            }, function(exception) {
                vm.responseMessage = exception.data.error.fieldErrors.name[0].message;
            });
        }

        //Method used to cancel class making
        function cancel () {
            vm.class.name = ' ';
            $location.path('/class-list').search({classAdded: ''});
        }

    }])
.name