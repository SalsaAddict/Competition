/// <reference path="../typings/angularjs/angular.d.ts" />

let comp: angular.IModule = angular.module("Competition", ["ui.bootstrap"]);

namespace SSC {
    interface ICompetitor { id: string; name: string; tally?: number[]; rank?: number; }
    interface IDivision { name: string; judges: string[]; competitors: ICompetitor[]; results: number[][]; calculated?: boolean; }
    interface ICompetition { name: string; divisions?: IDivision[]; }
    interface IPredicate { (competitor: ICompetitor): number; }
    export class Controller implements angular.IController {
        static $inject: string[] = ["$filter", "$log"];
        constructor(private $filter: angular.IFilterService, private $log: angular.ILogService) { }
        public readonly competition: ICompetition = {
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
        public division: IDivision;
        public get judges(): string[] {
            if (!angular.isDefined(this.division)) return;
            if (!angular.isArray(this.division.judges)) return;
            return this.division.judges;
        }
        public get competitors(): ICompetitor[] {
            if (!angular.isDefined(this.division)) return;
            if (!angular.isArray(this.division.competitors)) return;
            return this.$filter("orderBy")(this.division.competitors, "id");
        }
        public get results(): number[][] {
            if (!angular.isDefined(this.division)) return;
            if (!angular.isArray(this.division.results)) return;
            return this.division.results;
        }
        public get calculated(): boolean {
            if (!angular.isDefined(this.division)) return false;
            return this.division.calculated || false;
        }
        public calculate(): void {
            const majority: number = Math.ceil(this.judges.length / 2);
            this.competitors.forEach((competitor: ICompetitor, y: number): void => {
                competitor.tally = [];
                for (let i: number = 0; i < this.competitors.length; i++) {
                    let count: number = 0, sum: number = 0;
                    for (let x: number = 0; x < this.judges.length; x++) {
                        let result: number = this.results[y][x];
                        if (result <= i + 1) { count++; sum += result; }
                    }
                    if (count >= majority) competitor.tally.push(count, sum); else competitor.tally.push(null, null);
                }
            });
            let predicates: IPredicate[] = [];
            for (let i: number = 0; i < this.competitors.length; i++) {
                predicates.push(function (competitor: ICompetitor): number { return -competitor.tally[i * 2] || null; });
                predicates.push(function (competitor: ICompetitor): number { return competitor.tally[i * 2 + 1] || null; });
            }
            this.$filter("orderBy")(this.competitors, predicates)
                .forEach(function (competitor: ICompetitor, index: number): void {
                    competitor.rank = index + 1;
                });
            this.division.calculated = true;
            this.tab = this.tabs[2];
        }
        public edit(): void { delete this.division.calculated; }
        public rank(rank: number): string {
            return ["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th"][rank - 1];
        }
        public get tabs(): string[] { return ["Scoring", "Calculation", "Results"]; }
        public tab: string = this.tabs[0];
        public setTab(tab: string, $event: angular.IAngularEvent): void {
            $event.preventDefault();
            $event.stopPropagation();
            if (this.tabs.indexOf(tab) && !this.calculated) return;
            this.tab = tab;
        }
        public $postLink(): void {
            if (angular.isDefined(this.competition) && angular.isArray(this.competition.divisions)) {
                this.division = this.competition.divisions[0];
            }
        }
    }
    export namespace Results {
        export class Controller implements angular.IController {
            static $inject: string[] = ["$scope", "$element", "$timeout"];
            constructor(
                private $scope: angular.IScope,
                private $element: angular.IAugmentedJQuery,
                private $timeout: angular.ITimeoutService) { }
            public ngModel: angular.INgModelController;
            public results: number[][];
            public get x(): number { return this.$scope["$index"]; }
            public get y(): number { return this.$scope.$parent["$index"]; }
            public get value(): number { return this.results[this.y][this.x]; }
            public set value(value: number) { this.results[this.y][this.x] = value; }
            public setValidity(): void {
                this.$timeout((): void => {
                    if (this.ngModel.$valid) {
                        this.$element.removeClass("is-invalid").addClass("is-valid");
                    } else {
                        this.$element.removeClass("is-valid").addClass("is-invalid");
                    }
                });
            }
            public $postLink(): void {
                this.ngModel.$parsers.push((value: any): any => {
                    if (this.ngModel.$isEmpty(value)) return value;
                    let rx: RegExp = /^([1-8])$/;
                    if (!rx.test(value)) return;
                    return parseInt(value, 10);
                });
                this.ngModel.$validators["max"] = (modelValue: number, viewValue: string): boolean => {
                    return (modelValue <= this.results.length);
                }
                this.ngModel.$validators["duplicate"] = (modelValue: number, viewValue: string): boolean => {
                    let isValid: boolean = true;
                    for (let i: number = 0; i < this.results.length; i++) {
                        if (modelValue == this.results[i][this.x] && i !== this.y) {
                            isValid = false;
                            break;
                        }
                    }
                    return isValid;
                }
                this.ngModel.$viewChangeListeners.push((): void => { this.setValidity(); });
                this.setValidity();
            }
        }
        export function DirectiveFactory(): angular.IDirectiveFactory {
            let factory = function (): angular.IDirective {
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
    }
}

comp.controller("competitionController", SSC.Controller);
comp.directive("results", SSC.Results.DirectiveFactory());
