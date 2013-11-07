'use strict';

angular.module('meanRecipieApp')
  .factory('GameService', function () {

    var game = {};
    var cardIndex = 0;
    var scoreBoard = {};

    return {
      
      initScoreBoard: function() {
    	scoreBoard.score = 0;
    	if (game.deck) {
    		scoreBoard.outOf = game.deck.cards.length;
    	}
      },

      getGame: function () {
      	this.initScoreBoard();
        return game;
      },
      
      setGame: function (deck) {
        game.deck = deck;
        this.initScoreBoard();
      },

      getNextCard: function() {
      	var nextCard = game.deck.cards[cardIndex];
      	cardIndex = cardIndex + 1;
      	return nextCard;
      },
      
      checkGuess: function(translated, guess) {
      	if (translated === guess) {
      		return true;
      	}
      	return false;
      },

      updateScoreBoard: function(guessResult) {
      	if(guessResult) {
      		scoreBoard.score += 1;
      	}
      	return scoreBoard;
      },

      getScoreBoard: function() {
      	return scoreBoard;
      }

    };
  });
