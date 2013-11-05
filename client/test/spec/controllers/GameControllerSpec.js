'use strict';

describe('Controller: GameCtrl', function () {

  // load the controller's module
  beforeEach(module('meanRecipieApp'));

  var GameCtrl;
  var scope;
  var routeParams;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    routeParams = {};
    GameCtrl = $controller('GameCtrl', {
      $scope: scope
    });
  }));

  it('Takes name as id', inject(function($controller) {
        routeParams.name = 'Some Name';
        GameCtrl = $controller('GameCtrl', {
            $scope: scope,
            $routeParams : routeParams
        });        
        expect(scope.name).toEqual('Some Name');
    }));
});
