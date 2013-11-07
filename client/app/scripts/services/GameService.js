'use strict';

angular.module('meanRecipieApp')
  .factory('GameService', function () {

    var game = {};
    var cardIndex = 0;
    var score = 0;

    return {
      getGame: function () {
        return game;
      },
      
      setGame: function (deck) {
        game.deck = deck;
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

      updateScore: function(guessResult) {
      	if(guessResult) {
      		score = score + 1;
      	}
      }

    };
  });
