'use strict';

angular.module('meanRecipieApp')
  .controller('GameCtrl', function ($scope, $routeParams, GameService, Deck) {
    $scope.name = $routeParams.name;
    
    $scope.game = GameService.getGame();
    
    // If user refreshed page, GameService state is lost, refetch the deck from api
    if(!$scope.game.deck) {
    	var deck = Deck.get({name:$scope.name}, function(res) {
    		$scope.game.deck = deck;
    		$scope.currentCard = GameService.getNextCard();
		});
    } else {
    	$scope.currentCard = GameService.getNextCard();
    }

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
