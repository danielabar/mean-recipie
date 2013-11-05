'use strict';

angular.module('meanRecipieApp')
  .factory('GameService', function () {

    var game = {};

    // Public API here
    return {
      getGame: function () {
        return game;
      },
      setGame: function (deck) {
        game.deck = deck;
      }
    };
  });
