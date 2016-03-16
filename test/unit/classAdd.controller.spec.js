'use strict';

/* jasmine specs for controllers go here */
describe('Concept dictionary controllers', function() {

    beforeEach(function(){
        jasmine.addMatchers({
            toEqualData: function(util, customEqualityTesters) {
                return {
                    compare: function(actual, expected) {
                        var passed = angular.equals(actual, expected);
                        return {
                            pass: passed,
                            message: 'Expected ' + actual + (passed ? '' : ' not') + ' to equal ' + expected
                        }
                    }
                }
            }
        });
    });

    beforeEach(module('conceptDictionaryApp'));

    describe('ClassAddController', function() {
        var scope, ctrl, $httpBackend, location;

        beforeEach(inject(function(_$httpBackend_, $rootScope, $controller, _$location_) {
            $httpBackend = _$httpBackend_;
            $httpBackend.expectPOST('/ws/rest/v1/conceptclass').
            respond({results:{name: 'Anatomy', description: 'Anatomic sites / descriptors'}});

            scope = $rootScope.$new();

            location = _$location_;

            var newClass = {
                name:'Anatomy',
                description:'Anatomic sites / descriptors'
            };

            ctrl = $controller('ClassAddController', {$scope: scope, $location: _$location_});
            ctrl.class = newClass;
        }));

        it('should add new class ', function() {
            ctrl.addClass();
            $httpBackend.flush();
            expect(ctrl.success).toEqualData(true);
    });
});})