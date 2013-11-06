'use strict';

angular.module('meanRecipieApp')
  .controller('GameCtrl', function ($scope, $routeParams, GameService) {
    $scope.name = $routeParams.name;
    
    // TODO: if game not found, need to retrieve it (i.e. Deck) by name from service
    $scope.game = GameService.getGame();
    $scope.currentCard = GameService.getNextCard();

    $scope.checkGuess = function() {
    	if ($scope.currentCard.value === $scope.guess) {
    		$scope.correct = true;
    	} else {
    		$scope.incorrect = true;
    	}
    }

    $scope.moveAhead = function() {
    	$scope.currentCard = GameService.getNextCard(); // TODO: handle when we're at the end of the deck
    	$scope.correct = false;
    	$scope.incorrect = false;
    	$scope.guess = " ";

    	// TEST
    	$scope.currentCard.value = "BOO";
    }

  });
