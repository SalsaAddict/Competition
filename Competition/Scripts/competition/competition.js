/// <reference path="../typings/angularjs/angular.d.ts" />
var comp = angular.module("Competition", ["ui.bootstrap"]);
var SSC;
(function (SSC) {
    var Controller = /** @class */ (function () {
        function Controller($filter, $log) {
            this.$filter = $filter;
            this.$log = $log;
            this.competition = {
                name: "Skating System Example",
                divisions: [
                    {
                        name: "Salsa Couples",
                        judges: ["John", "Paul", "Ringo", "George", "Beyoncé", "Kelly", "Michelle"],
                        competitors: [
                            { id: "53", name: "Ross & Rachel" },
                            { id: "51", name: "Bonnie & Clyde" },
                            { id: "52", name: "Fred & Ginger" },
                            { id: "54", name: "Mork & Mindy" },
                            { id: "55", name: "Sheldon & Amy" }
                        ],
                        results: [
                            [1, 1, 1, 1, 1, 1, 1],
                            [2, 2, 2, 2, 2, 2, 2],
                            [3, 3, 3, 3, 3, 3, 3],
                            [4, 4, 4, 4, 4, 4, 4],
                            [5, 5, 5, 5, 5, 5, 5]
                        ]
                    },
                    { name: "Bachata Couples", judges: [], competitors: [], results: [] }
                ]
            };
        }
        Object.defineProperty(Controller.prototype, "judges", {
            get: function () {
                if (!angular.isDefined(this.division))
                    return;
                if (!angular.isArray(this.division.judges))
                    return;
                return this.division.judges;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Controller.prototype, "x", {
            get: function () { return (angular.isArray(this.judges)) ? this.judges.length : 0; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Controller.prototype, "competitors", {
            get: function () {
                if (!angular.isDefined(this.division))
                    return;
                if (!angular.isArray(this.division.competitors))
                    return;
                return this.$filter("orderBy")(this.division.competitors, "id");
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Controller.prototype, "y", {
            get: function () { return (angular.isArray(this.competitors)) ? this.competitors.length : 0; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Controller.prototype, "results", {
            get: function () {
                if (!angular.isDefined(this.division))
                    return;
                if (!angular.isArray(this.division.results))
                    return;
                return this.division.results;
            },
            enumerable: true,
            configurable: true
        });
        Controller.prototype.$postLink = function () {
            if (angular.isDefined(this.competition) && angular.isArray(this.competition.divisions))
                this.division = this.competition.divisions[0];
        };
        Controller.$inject = ["$filter", "$log"];
        return Controller;
    }());
    SSC.Controller = Controller;
    var Results;
    (function (Results) {
        var Controller = /** @class */ (function () {
            function Controller($element) {
                this.$element = $element;
            }
            Controller.prototype.$postLink = function () {
                var _this = this;
                this.ngModel.$parsers.push(function (value) {
                    var rx = /^([1-8])$/;
                    if (rx.test(value)) {
                        var result = parseInt(value, 10);
                        if (result <= _this.results.length) {
                            _this.$element.removeClass("is-invalid").addClass("is-valid");
                            return result;
                        }
                    }
                    _this.$element.removeClass("is-valid").addClass("is-invalid");
                    return;
                });
            };
            Controller.$inject = ["$element"];
            return Controller;
        }());
        Results.Controller = Controller;
        function DirectiveFactory() {
            var factory = function () {
                return {
                    restrict: "A",
                    controller: Controller,
                    bindToController: { results: "=" },
                    require: { ngModel: "ngModel" }
                };
            };
            return factory;
        }
        Results.DirectiveFactory = DirectiveFactory;
    })(Results = SSC.Results || (SSC.Results = {}));
})(SSC || (SSC = {}));
var Competition;
(function (Competition) {
    "use strict";
    var Controller = /** @class */ (function () {
        function Controller($filter, $log) {
            this.$filter = $filter;
            this.$log = $log;
            //public judges: string[] = ["Alex", "Biskit", "Pierre"]; //, "Dan", "Julian"];
            this.judges = ["A", "B", "C", "D", "E", "F", "G"];
            this.competitors = [
                { id: 71, name: '71', results: [3, 1, 6, 1, 1, 2, 1] },
                { id: 72, name: '72', results: [2, 2, 1, 5, 3, 1, 3] },
                { id: 73, name: '73', results: [1, 5, 4, 2, 2, 6, 2] },
                { id: 74, name: '74', results: [5, 4, 2, 4, 6, 5, 4] },
                { id: 75, name: '75', results: [4, 6, 3, 3, 5, 4, 6] },
                { id: 76, name: '76', results: [6, 3, 5, 6, 4, 3, 5] }
                /*
    
                { id: 81, name: '81', results: [3, 3, 3, 2, 5, 2, 3] },
                { id: 82, name: '82', results: [4, 4, 4, 3, 2, 3, 2] },
                { id: 83, name: '83', results: [2, 2, 6, 6, 4, 1, 4] },
                { id: 84, name: '84', results: [1, 6, 1, 5, 1, 4, 6] },
                { id: 85, name: '85', results: [5, 5, 5, 1, 3, 6, 1] },
                { id: 86, name: '86', results: [6, 1, 2, 4, 6, 5, 5] }
                { id: 2, name: "Ylenio", results: [1, 1, 2] },
                { id: 1, name: "Sergio", results: [2, 3, 1] },
                { id: 4, name: "Fenix", results: [3, 2, 3] },
                { id: 5, name: "Raj", results: [4, 4, 5] },
                { id: 3, name: "Vaibhav", results: [5, 5, 4] }
                */
            ];
            this._calculated = false;
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
                    if (tally.count >= _this.majority)
                        tally.majority = true;
                    competitor.tally.push(tally);
                };
                for (var i = 0; i < _this.competitors.length; i++) {
                    _loop_1(i);
                }
            });
        };
        Controller.prototype.ranked = function () {
            var predicates = [];
            var _loop_2 = function (i) {
                predicates.push(function (competitor) {
                    var tally = competitor.tally[i];
                    return (tally.majority) ? -tally.count : null;
                });
                predicates.push(function (competitor) {
                    var tally = competitor.tally[i];
                    return (tally.majority) ? tally.sum : null;
                });
            };
            for (var i = 0; i < this.competitors.length; i++) {
                _loop_2(i);
            }
            this.$log.debug("predicates", predicates);
            return this.$filter("orderBy")(this.competitors, predicates);
        };
        Object.defineProperty(Controller.prototype, "majority", {
            get: function () { return Math.ceil(this.judges.length / 2); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Controller.prototype, "calculated", {
            get: function () { return this._calculated; },
            enumerable: true,
            configurable: true
        });
        Controller.prototype.calculate = function () {
            this.tally();
            this.ranked().forEach(function (competitor, index) {
                competitor.rank = index + 1;
            });
            this._calculated = true;
        };
        Controller.prototype.download = function () {
            var data = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(this.competitors));
            var downloader = document.createElement("a");
            downloader.setAttribute("href", "data:" + data);
            downloader.setAttribute("download", "competition.json");
            downloader.click();
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
comp.controller("competitionController", SSC.Controller);
comp.directive("results", SSC.Results.DirectiveFactory());
//comp.directive("rankInput", Competition.RankInput.DirectiveFactory());
//# sourceMappingURL=competition.js.map