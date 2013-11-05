'use strict';

angular.module('meanRecipieApp')
  .controller('GameCtrl', function ($scope, $routeParams, GameService) {
    $scope.name = $routeParams.name;
    $scope.game = GameService.getGame();
    // TODO: if game not found, need to retrieve it by name from service
  });
