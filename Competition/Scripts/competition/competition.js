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
        Controller.prototype.tally = function () {
            var _this = this;
            this.competitors.forEach(function (competitor) {
                competitor.tally = [];
                var _loop_1 = function (i) {
                    var tally = { majority: false, count: 0, sum: 0 };
                    competitor.results.forEach(function (result) {
                        if (result <= i + 1) {
                            tally.count++;
                            tally.sum += result;
                        }
                    });
                    if (tally.count > _this.majority)
                        tally.majority = true;
                    competitor.tally.push(tally);
                };
                for (var i = 0; i < _this.competitors.length; i++) {
                    _loop_1(i);
                }
            });
        };
        Controller.prototype.ranked = function () {
            var _this = this;
            return this.$filter("orderBy")(this.competitors, function () {
                var predicate = [];
                var _loop_2 = function (i) {
                    var predicate_1 = function (competitor) {
                        return competitor.tally[i];
                    };
                };
                for (var i = 0; i < _this.competitors.length; i++) {
                    _loop_2(i);
                }
                return predicate;
            });
        };
        Object.defineProperty(Controller.prototype, "majority", {
            get: function () { return Math.ceil(this.judges.length / 2); },
            enumerable: true,
            configurable: true
        });
        Controller.prototype.calculate = function () {
            this.tally();
            this.ranked().forEach(function (competitor, index) {
                competitor.rank = index + 1;
            });
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