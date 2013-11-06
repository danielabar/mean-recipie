'use strict';

angular.module('meanRecipieApp')
  .factory('GameService', function () {

    var game = {};
    var cardIndex = 0;

    // Public API here
    return {
      getGame: function () {
        return game;
      },
      setGame: function (deck) {
        game.deck = deck;
      },
      getNextCard: function() {
      	return game.deck.cards[cardIndex];
      	cardIndex = cardIndex + 1;
      }
    };
  });
