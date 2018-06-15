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
                            { id: "71", name: "Ross & Rachel" },
                            { id: "72", name: "Bonnie & Clyde" },
                            { id: "73", name: "Fred & Ginger" },
                            { id: "74", name: "Mork & Mindy" },
                            { id: "75", name: "Sheldon & Amy" },
                            { id: "76", name: "Romeo & Juliet" }
                        ],
                        results: [
                            [1, 5, 4, 2, 2, 6, 2],
                            [4, 6, 3, 3, 5, 4, 6],
                            [5, 4, 2, 4, 6, 5, 4],
                            [3, 1, 6, 1, 1, 2, 1],
                            [2, 2, 1, 5, 3, 1, 3],
                            [6, 3, 5, 6, 4, 3, 5]
                        ]
                    },
                    { name: "Bachata Couples", judges: [], competitors: [], results: [] }
                ]
            };
            this.tab = this.tabs[0];
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
        Object.defineProperty(Controller.prototype, "calculated", {
            get: function () {
                if (!angular.isDefined(this.division))
                    return false;
                return this.division.calculated || false;
            },
            enumerable: true,
            configurable: true
        });
        Controller.prototype.calculate = function () {
            var _this = this;
            var majority = Math.ceil(this.judges.length / 2);
            this.competitors.forEach(function (competitor, y) {
                competitor.tally = [];
                for (var i = 0; i < _this.competitors.length; i++) {
                    var count = 0, sum = 0;
                    for (var x = 0; x < _this.judges.length; x++) {
                        var result = _this.results[y][x];
                        if (result <= i + 1) {
                            count++;
                            sum += result;
                        }
                    }
                    if (count >= majority)
                        competitor.tally.push(count, sum);
                    else
                        competitor.tally.push(null, null);
                }
            });
            var predicates = [];
            var _loop_1 = function (i) {
                predicates.push(function (competitor) { return -competitor.tally[i * 2] || null; });
                predicates.push(function (competitor) { return competitor.tally[i * 2 + 1] || null; });
            };
            for (var i = 0; i < this.competitors.length; i++) {
                _loop_1(i);
            }
            this.$filter("orderBy")(this.competitors, predicates)
                .forEach(function (competitor, index) {
                competitor.rank = index + 1;
            });
            this.division.calculated = true;
            this.tab = this.tabs[2];
        };
        Controller.prototype.edit = function () {
            delete this.division.calculated;
            this.tab = this.tabs[0];
        };
        Controller.prototype.rank = function (rank) {
            return ["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th"][rank - 1];
        };
        Object.defineProperty(Controller.prototype, "tabs", {
            get: function () { return ["Scoring", "Calculation", "Results"]; },
            enumerable: true,
            configurable: true
        });
        Controller.prototype.setTab = function (tab, $event) {
            $event.preventDefault();
            $event.stopPropagation();
            if (this.tabs.indexOf(tab) && !this.calculated)
                return;
            this.tab = tab;
        };
        Controller.prototype.$postLink = function () {
            if (angular.isDefined(this.competition) && angular.isArray(this.competition.divisions)) {
                this.division = this.competition.divisions[0];
            }
        };
        Controller.$inject = ["$filter", "$log"];
        return Controller;
    }());
    SSC.Controller = Controller;
    var Results;
    (function (Results) {
        var Controller = /** @class */ (function () {
            function Controller($scope, $element, $timeout) {
                this.$scope = $scope;
                this.$element = $element;
                this.$timeout = $timeout;
            }
            Object.defineProperty(Controller.prototype, "x", {
                get: function () { return this.$scope["$index"]; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Controller.prototype, "y", {
                get: function () { return this.$scope.$parent["$index"]; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Controller.prototype, "value", {
                get: function () { return this.results[this.y][this.x]; },
                set: function (value) { this.results[this.y][this.x] = value; },
                enumerable: true,
                configurable: true
            });
            Controller.prototype.setValidity = function () {
                var _this = this;
                this.$timeout(function () {
                    if (_this.ngModel.$valid) {
                        _this.$element.removeClass("is-invalid").addClass("is-valid");
                    }
                    else {
                        _this.$element.removeClass("is-valid").addClass("is-invalid");
                    }
                });
            };
            Controller.prototype.$postLink = function () {
                var _this = this;
                this.ngModel.$parsers.push(function (value) {
                    if (_this.ngModel.$isEmpty(value))
                        return value;
                    var rx = /^([1-8])$/;
                    if (!rx.test(value))
                        return;
                    return parseInt(value, 10);
                });
                this.ngModel.$validators["max"] = function (modelValue, viewValue) {
                    return (modelValue <= _this.results.length);
                };
                this.ngModel.$validators["duplicate"] = function (modelValue, viewValue) {
                    var isValid = true;
                    for (var i = 0; i < _this.results.length; i++) {
                        if (modelValue == _this.results[i][_this.x] && i !== _this.y) {
                            isValid = false;
                            break;
                        }
                    }
                    return isValid;
                };
                this.ngModel.$viewChangeListeners.push(function () { _this.setValidity(); });
                this.setValidity();
            };
            Controller.$inject = ["$scope", "$element", "$timeout"];
            return Controller;
        }());
        Results.Controller = Controller;
        function DirectiveFactory() {
            var factory = function () {
                return {
                    restrict: "A",
                    controller: Controller,
                    controllerAs: "$results",
                    bindToController: { results: "=" },
                    require: { ngModel: "ngModel" }
                };
            };
            return factory;
        }
        Results.DirectiveFactory = DirectiveFactory;
    })(Results = SSC.Results || (SSC.Results = {}));
})(SSC || (SSC = {}));
comp.controller("competitionController", SSC.Controller);
comp.directive("results", SSC.Results.DirectiveFactory());
//# sourceMappingURL=competition.js.map