/*jshint undef: false, unused: false, indent: 2*/
/*global angular: false */

'use strict';

var BoardDataFactories = angular.module('BoardDataFactories', []);
BoardDataFactories.service('BoardDataFactory', function () {

  return {
    kanban: {
      "name": "Kanban Board",
      "numberOfColumns": 2,
      "columns": [
        {"name": "查询子车型", "cards": [
          {"title": "Come up with a POC for new Project"},
          {"title": "Design new framework for reporting module"}
        ]},
        {"name": "添加子车型", "cards": [
          {"title": "Explore new IDE for Development",
            "details": "Testing Card Details"},
          {"title": "Get new resource for new Project",
            "details": "Testing Card Details"}
        ]}
      ]
    }
  };
});


