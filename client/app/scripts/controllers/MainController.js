'use strict';

angular.module('meanRecipieApp')
  .controller('MainCtrl', function ($scope, Deck) {
  	$scope.decks = Deck.query();
  });
