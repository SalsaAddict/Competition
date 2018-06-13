/// <reference path="../typings/angularjs/angular.d.ts" />

let comp: angular.IModule = angular.module("Competition", ["ui.bootstrap"]);

namespace SSC {
    interface ICompetitor { id: string; name: string; }
    interface IDivision { name: string; judges: string[]; competitors: ICompetitor[]; results: number[][]; }
    interface ICompetition { name: string; divisions?: IDivision[]; }
    export class Controller implements angular.IController {
        static $inject: string[] = ["$filter", "$log"];
        constructor(private $filter: angular.IFilterService, private $log: angular.ILogService) { }
        public competition: ICompetition = {
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
        public division: IDivision;
        public get judges(): string[] {
            if (!angular.isDefined(this.division)) return;
            if (!angular.isArray(this.division.judges)) return;
            return this.division.judges;
        }
        public get x(): number { return (angular.isArray(this.judges)) ? this.judges.length : 0; }
        public get competitors(): ICompetitor[] {
            if (!angular.isDefined(this.division)) return;
            if (!angular.isArray(this.division.competitors)) return;
            return this.$filter("orderBy")(this.division.competitors, "id");
        }
        public get y(): number { return (angular.isArray(this.competitors)) ? this.competitors.length : 0; }
        public get results(): number[][] {
            if (!angular.isDefined(this.division)) return;
            if (!angular.isArray(this.division.results)) return;
            return this.division.results;
        }
        public $postLink(): void {
            if (angular.isDefined(this.competition) && angular.isArray(this.competition.divisions)) this.division = this.competition.divisions[0];
        }
    }
    export namespace Results {
        export class Controller implements angular.IController {
            static $inject: string[] = ["$element"];
            constructor(private $element: angular.IAugmentedJQuery) { }
            public ngModel: angular.INgModelController;
            public results: number[][];
            public $postLink(): void {
                this.ngModel.$parsers.unshift(function (value: any): number { return parseInt(value, 10); });
                this.ngModel.$validators["min"] = (modelValue: number, viewValue: string): boolean => { return (modelValue >= 1); }
                this.ngModel.$validators["max"] = (modelValue: number, viewValue: string): boolean => { return (modelValue <= this.results.length); }
                this.ngModel.$viewChangeListeners.push((): void => {
                    console.log("nnn");
                    if (this.ngModel.$invalid) {
                        this.$element.addClass("is-invalid");
                        this.$element.removeClass("is-valid");
                    } else {
                        this.$element.addClass("is-valid");
                        this.$element.removeClass("is-invalid");
                    }
                });
            }
        }
        export function DirectiveFactory(): angular.IDirectiveFactory {
            let factory = function (): angular.IDirective {
                return {
                    restrict: "A",
                    controller: Controller,
                    bindToController: { results: "=" },
                    require: { ngModel: "ngModel" }
                };
            };
            return factory;
        }
    }
}



namespace Competition {
    "use strict";
    interface ITally { majority: boolean; count: number; sum: number; }
    interface IPredicate { (competitor: ICompetitor): number; }
    interface ICompetitor { id: number; name: string; results: number[]; tally?: ITally[]; rank?: number; }
    export class Controller implements angular.IController {
        static $inject: string[] = ["$filter", "$log"];
        constructor(private $filter: angular.IFilterService, private $log: angular.ILogService) { }
        //public judges: string[] = ["Alex", "Biskit", "Pierre"]; //, "Dan", "Julian"];
        public judges: string[] = ["A", "B", "C", "D", "E", "F", "G"];
        public competitors: ICompetitor[] = [
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
        public get competitorsById(): ICompetitor[] { return this.$filter("orderBy")(this.competitors, "id"); }
        public judgeResults(judge: string): number[] {
            let jIndex: number = this.judges.indexOf(judge),
                results: number[] = [];
            this.competitorsById.forEach(function (competitor: ICompetitor) {
                results.push(competitor.results[jIndex] || null);
            });
            return results;
        }
        public isValidResult(results: number[], index: number): boolean {
            let result: number = results[index] || null;
            if (result === null) return false;
            if (result < 1) return false;
            if (result > this.competitors.length) return false;
            if (results.indexOf(result, index + 1) > -1) return false;
            return true;
        }
        public isValidJudge(judge: string): boolean {
            let isValid: boolean = true, results: number[] = this.judgeResults(judge);
            for (let i: number = 0; i < results.length; i++) {
                if (!this.isValidResult(results, i)) {
                    isValid = false;
                    break;
                }
            }
            return isValid;
        }
        public isValidCompetitor(index: number): boolean {
            let isValid: boolean = true;
            for (let i: number = 0; i < this.judges.length; i++) {
                if (!this.isValidResult(this.judgeResults(this.judges[i]), index)) {
                    isValid = false;
                    break;
                }
            }
            return isValid;
        }
        public isValid(): boolean {
            let isValid: boolean = true;
            for (let i: number = 0; i < this.judges.length; i++) {
                if (!this.isValidJudge(this.judges[i])) {
                    isValid = false;
                    break;
                }
            }
            return isValid;
        }
        public tally(): void {
            this.competitors.forEach((competitor: ICompetitor): void => {
                competitor.tally = [];
                for (let i: number = 0; i < this.competitors.length; i++) {
                    let tally: ITally = { majority: false, count: 0, sum: 0 };
                    competitor.results.forEach((result: number): void => {
                        if (result <= i + 1) {
                            tally.count++;
                            tally.sum += result;
                        }
                    });
                    if (tally.count >= this.majority) tally.majority = true;
                    competitor.tally.push(tally);
                }
            });
        }
        public ranked(): ICompetitor[] {
            let predicates: IPredicate[] = [];
            for (let i: number = 0; i < this.competitors.length; i++) {
                predicates.push(function (competitor: ICompetitor): number {
                    let tally: ITally = competitor.tally[i];
                    return (tally.majority) ? -tally.count : null;
                });
                predicates.push(function (competitor: ICompetitor): number {
                    let tally: ITally = competitor.tally[i];
                    return (tally.majority) ? tally.sum : null;
                });
            }
            this.$log.debug("predicates", predicates);
            return this.$filter("orderBy")(this.competitors, predicates);
        }
        public get majority(): number { return Math.ceil(this.judges.length / 2); }
        private _calculated: boolean = false;
        public get calculated(): boolean { return this._calculated; }
        public calculate(): void {
            this.tally();
            this.ranked().forEach(function (competitor: ICompetitor, index: number) {
                competitor.rank = index + 1;
            });
            this._calculated = true;
        }
        public download(): void {
            let data: string = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(this.competitors));
            let downloader: HTMLAnchorElement = document.createElement("a");
            downloader.setAttribute("href", "data:" + data);
            downloader.setAttribute("download", "competition.json");
            downloader.click();
        }
        public $postLink(): void { }
    }
    export namespace RankInput {
        export class Controller implements angular.IController {
            public ngModel: angular.INgModelController;
            public max: number;
            public $postLink(): void {
                this.ngModel.$parsers.unshift(function (value: any): number { return parseInt(value, 10); });
                this.ngModel.$validators["min"] = (modelValue: number, viewValue: string): boolean => { return (modelValue >= 1); }
                this.ngModel.$validators["max"] = (modelValue: number, viewValue: string): boolean => { return (modelValue <= this.max); }
            }
        }
        export function DirectiveFactory(): angular.IDirectiveFactory {
            let factory = function (): angular.IDirective {
                return {
                    restrict: "A",
                    controller: Controller,
                    bindToController: { max: "=rankInput" },
                    require: { ngModel: "^ngModel" }
                };
            };
            return factory;
        }
    }
}

comp.controller("competitionController", SSC.Controller);
comp.directive("results", SSC.Results.DirectiveFactory());
//comp.directive("rankInput", Competition.RankInput.DirectiveFactory());