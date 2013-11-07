'use strict';

angular.module('meanRecipieApp')
  .controller('GameCtrl', function ($scope, $routeParams, GameService) {
    $scope.name = $routeParams.name;
    
    // TODO: if game not found, need to retrieve it (i.e. Deck) by name from service
    $scope.game = GameService.getGame();
    $scope.currentCard = GameService.getNextCard();

    $scope.checkGuess = function() {
    	if ($scope.currentCard.translated === $scope.guess) {
    		$scope.correct = true;
    	} else {
    		$scope.incorrect = true;
    	}
    }

    $scope.moveAhead = function() {
    	// TODO: handle when we're at the end of the deck
    	$scope.currentCard = GameService.getNextCard(); 
    	$scope.correct = false;
    	$scope.incorrect = false;
    	$scope.guess = " ";
    }

  });
