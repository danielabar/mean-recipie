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
    	var result = GameService.checkGuess($scope.currentCard.translated, $scope.guess);
    	$scope.feedback = result ? 'Correct' : 'Incorrect';
    	GameService.updateScore(result);
    	moveAhead();
    }

    $scope.clearFeedback = function() {
    	$scope.feedback = null;
    }

    var moveAhead = function() {
    	// TODO: handle when we're at the end of the deck
    	$scope.currentCard = GameService.getNextCard(); 
    	$scope.correct = false;
    	$scope.incorrect = false;
    	$scope.guess = " ";
    }

  });
