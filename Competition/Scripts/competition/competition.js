/// <reference path="../typings/angularjs/angular.d.ts" />
var comp = angular.module("Competition", ["ui.bootstrap"]);
var Competition;
(function (Competition) {
    "use strict";
    var Controller = /** @class */ (function () {
        function Controller($filter, $log) {
            this.$filter = $filter;
            this.$log = $log;
            this.judges = ["Alex", "Biskit", "Pierre"]; //, "Dan", "Julian"];
            this.competitors = [
                { id: 2, name: "Ylenio", results: [1, 1, 2] },
                { id: 1, name: "Sergio", results: [2, 3, 1] },
                { id: 4, name: "Fenix", results: [3, 2, 3] },
                { id: 5, name: "Raj", results: [4, 4, 5] },
                { id: 3, name: "Vaibhav", results: [5, 5, 4] }
            ];
        }
        Object.defineProperty(Controller.prototype, "competitorsById", {
            get: function () { return this.$filter("orderBy")(this.competitors, "id"); },
            enumerable: true,
            configurable: true
        });
        Controller.prototype.judgeResults = function (judge) {
            var jIndex = this.judges.indexOf(judge), results = [];
            this.competitorsById.forEach(function (competitor) {
                results.push(competitor.results[jIndex] || null);
            });
            return results;
        };
        Controller.prototype.isValidResult = function (results, index) {
            var result = results[index] || null;
            if (result === null)
                return false;
            if (result < 1)
                return false;
            if (result > this.competitors.length)
                return false;
            if (results.indexOf(result, index + 1) > -1)
                return false;
            return true;
        };
        Controller.prototype.isValidJudge = function (judge) {
            var isValid = true, results = this.judgeResults(judge);
            for (var i = 0; i < results.length; i++) {
                if (!this.isValidResult(results, i)) {
                    isValid = false;
                    break;
                }
            }
            return isValid;
        };
        Controller.prototype.isValidCompetitor = function (index) {
            var isValid = true;
            for (var i = 0; i < this.judges.length; i++) {
                if (!this.isValidResult(this.judgeResults(this.judges[i]), index)) {
                    isValid = false;
                    break;
                }
            }
            return isValid;
        };
        Controller.prototype.isValid = function () {
            var isValid = true;
            for (var i = 0; i < this.judges.length; i++) {
                if (!this.isValidJudge(this.judges[i])) {
                    isValid = false;
                    break;
                }
            }
            return isValid;
        };
        Object.defineProperty(Controller.prototype, "majority", {
            get: function () { return Math.ceil(this.judges.length / 2); },
            enumerable: true,
            configurable: true
        });
        Controller.prototype.majorityCount = function (competitor, rank) {
            var count = 0;
            for (var i = 0; i < competitor.results.length; i++) {
                if (competitor.results[i] <= rank)
                    count++;
            }
            return count;
        };
        Controller.prototype.simpleMajority = function (rank) {
            var _this = this;
            var output = [];
            this.competitors.forEach(function (competitor) {
                if (angular.isDefined(competitor.rank))
                    return;
                if (_this.majorityCount(competitor, rank) >= _this.majority)
                    output.push(competitor);
            });
            return output;
        };
        Controller.prototype.assignRank = function (rank) {
            this.$log.debug("assignRank", rank);
            var simpleMajority = this.simpleMajority(rank);
            this.$log.debug("simpleMajority", rank, simpleMajority.length, simpleMajority);
            if (simpleMajority.length === 1) {
                simpleMajority[0].rank = rank;
                return;
            }
        };
        Controller.prototype.calculate = function () {
            this.assignRank(1);
            this.assignRank(2);
            this.assignRank(3);
            this.assignRank(4);
            this.assignRank(5);
        };
        Controller.prototype.$postLink = function () { };
        Controller.$inject = ["$filter", "$log"];
        return Controller;
    }());
    Competition.Controller = Controller;
    var RankInput;
    (function (RankInput) {
        var Controller = /** @class */ (function () {
            function Controller() {
            }
            Controller.prototype.$postLink = function () {
                var _this = this;
                this.ngModel.$parsers.unshift(function (value) { return parseInt(value, 10); });
                this.ngModel.$validators["min"] = function (modelValue, viewValue) { return (modelValue >= 1); };
                this.ngModel.$validators["max"] = function (modelValue, viewValue) { return (modelValue <= _this.max); };
            };
            return Controller;
        }());
        RankInput.Controller = Controller;
        function DirectiveFactory() {
            var factory = function () {
                return {
                    restrict: "A",
                    controller: Controller,
                    bindToController: { max: "=rankInput" },
                    require: { ngModel: "^ngModel" }
                };
            };
            return factory;
        }
        RankInput.DirectiveFactory = DirectiveFactory;
    })(RankInput = Competition.RankInput || (Competition.RankInput = {}));
})(Competition || (Competition = {}));
comp.controller("competitionController", Competition.Controller);
comp.directive("rankInput", Competition.RankInput.DirectiveFactory());
//# sourceMappingURL=competition.js.map