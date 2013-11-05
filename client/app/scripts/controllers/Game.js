'use strict';

angular.module('meanRecipieApp')
  .controller('GameCtrl', function ($scope, $routeParams) {
    $scope.name = $routeParams.name;
  });
