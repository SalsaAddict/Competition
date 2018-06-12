/// <reference path="../typings/angularjs/angular.d.ts" />
var comp = angular.module("Competition", ["ui.bootstrap"]);
var Competition;
(function (Competition) {
    "use strict";
    var Controller = /** @class */ (function () {
        function Controller($filter) {
            this.$filter = $filter;
            this.judges = ["Alex", "Biskit", "Pierre"]; //, "Dan", "Julian"];
            this.competitors = [
                { id: 2, name: "Ylenio", results: [] },
                { id: 1, name: "Sergio", results: [] },
                { id: 4, name: "Fenix", results: [] },
                { id: 5, name: "Raj", results: [] },
                { id: 3, name: "Vaibhav", results: [] }
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
        Controller.prototype.simpleMajority = function (rank) {
            var _this = this;
            var output = [];
            this.competitors.forEach(function (competitor) {
                var count = 0;
                for (var i = 0; i < competitor.results.length; i++) {
                    if (competitor.results[i] <= rank) {
                        count++;
                        if (count >= _this.majority) {
                            output.push(competitor);
                            break;
                        }
                    }
                }
            });
            return output;
        };
        Controller.prototype.$postLink = function () { };
        Controller.$inject = ["$filter"];
        return Controller;
    }());
    Competition.Controller = Controller;
})(Competition || (Competition = {}));
comp.controller("competitionController", Competition.Controller);
//# sourceMappingURL=competition.js.map