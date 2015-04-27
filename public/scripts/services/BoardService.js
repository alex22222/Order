/*jshint undef: false, unused: false, indent: 2*/
/*global angular: false */

'use strict';

var BoardServices = angular.module('BoardServices', []);
BoardServices.service('BoardService', ['$modal', 'BoardManipulator',
    function($modal, BoardManipulator) {

        return {
            removeCard: function(board, column, card) {
                BoardManipulator.removeCardFromColumn(board, column, card);
            },
            kanbanBoard: function(board) {
                var kanbanBoard = new Board(board.name, board.numberOfColumns);
                angular.forEach(board.columns, function(column) {
                    BoardManipulator.addColumn(kanbanBoard, column.name);
                    angular.forEach(column.cards, function(card) {
                        BoardManipulator.addCardToColumn(kanbanBoard, column, card.title, card);
                    });
                });
                return kanbanBoard;
            },
            initBoard: function(items1, items2) {
                var kanban = {};
                kanban.name = 'Kanban Board';
                kanban.numberOfColumns = 2;
                var kanbanCols = new Array();
                var column = {};
                column.name = '可加车型';
                column.cards = [];
                kanbanCols.push(column);
                var column2 = {};
                column2.name = '已加车型';
                column2.cards = [];
                angular.forEach(items2, function(vehicle) {
                    column2.cards.push(vehicle);
                });
                kanbanCols.push(column2);
                kanban.columns = kanbanCols;
                return kanban;
            },
            initOptions: function(component, kanbanBoard) {
                return {
                    itemMoved: function(event) {
                        event.source.itemScope.modelValue.status = event.dest.sortableScope.$parent.column.name;
                        component.vehicles = kanbanBoard.columns[1].cards;
                    },
                    orderChanged: function(event) {},
                    containment: '#board'
                };
            }
        };
    }
]);
