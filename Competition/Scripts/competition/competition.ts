/// <reference path="../typings/angularjs/angular.d.ts" />

let comp: angular.IModule = angular.module("Competition", ["ui.bootstrap"]);

namespace Competition {
    "use strict";
    interface ITally { majority: boolean; count: number; sum: number; }
    interface IPredicate { (competitor: ICompetitor): ITally; }
    interface ICompetitor { id: number; name: string; results: number[]; tally?: ITally[]; rank?: number; }
    export class Controller implements angular.IController {
        static $inject: string[] = ["$filter", "$log"];
        constructor(private $filter: angular.IFilterService, private $log: angular.ILogService) { }
        public judges: string[] = ["Alex", "Biskit", "Pierre"]; //, "Dan", "Julian"];
        public competitors: ICompetitor[] = [
            { id: 2, name: "Ylenio", results: [1, 1, 2] },
            { id: 1, name: "Sergio", results: [2, 3, 1] },
            { id: 4, name: "Fenix", results: [3, 2, 3] },
            { id: 5, name: "Raj", results: [4, 4, 5] },
            { id: 3, name: "Vaibhav", results: [5, 5, 4] }
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
                    if (tally.count > this.majority) tally.majority = true;
                    competitor.tally.push(tally);
                }
            });
        }
        public ranked(): ICompetitor[] {
            return this.$filter("orderBy")(this.competitors,
                (): IPredicate[] => {
                    let predicate: IPredicate[] = [];
                    for (let i: number = 0; i < this.competitors.length; i++) {
                        let predicate: IPredicate = function (competitor: ICompetitor): ITally {
                            return competitor.tally[i];
                        };
                    }
                    return predicate;
                });
        }
        public get majority(): number { return Math.ceil(this.judges.length / 2); }
        public calculate(): void {
            this.tally();
            this.ranked().forEach(function (competitor: ICompetitor, index: number) {
                competitor.rank = index + 1;
            });
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

comp.controller("competitionController", Competition.Controller);
comp.directive("rankInput", Competition.RankInput.DirectiveFactory());