/*jshint undef: false, unused: false, indent: 2*/
/*global angular: false */

'use strict';

var BoardServices = angular.module('BoardServices', []);
BoardServices.service('BoardService', ['$modal', 'BoardManipulator', function ($modal, BoardManipulator) {

  return {
    removeCard: function (board, column, card) {
        BoardManipulator.removeCardFromColumn(board, column, card);
    },
    kanbanBoard: function (board) {
      var kanbanBoard = new Board(board.name, board.numberOfColumns);
      angular.forEach(board.columns, function (column) {
        BoardManipulator.addColumn(kanbanBoard, column.name);
        angular.forEach(column.cards, function (card) {
          BoardManipulator.addCardToColumn(kanbanBoard, column, card.title, card);
        });
      });
      return kanbanBoard;
    }
  };
}]);