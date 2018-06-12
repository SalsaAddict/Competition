/// <reference path="../typings/angularjs/angular.d.ts" />

let comp: angular.IModule = angular.module("Competition", ["ui.bootstrap"]);

namespace Competition {
    "use strict";
    interface ICompetitor { id: number; name: string; results: number[]; }
    export class Controller implements angular.IController {
        static $inject: string[] = ["$filter"];
        constructor(private $filter: angular.IFilterService) { }
        public judges: string[] = ["Alex", "Biskit", "Pierre"]; //, "Dan", "Julian"];
        public competitors: ICompetitor[] = [
            { id: 2, name: "Ylenio", results: [] },
            { id: 1, name: "Sergio", results: [] },
            { id: 4, name: "Fenix", results: [] },
            { id: 5, name: "Raj", results: [] },
            { id: 3, name: "Vaibhav", results: [] }
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
        public get majority(): number { return Math.ceil(this.judges.length / 2); }
        public simpleMajority(rank: number): ICompetitor[] {
            let output: ICompetitor[] = [];
            this.competitors.forEach((competitor: ICompetitor): void => {
                let count: number = 0;
                for (let i: number = 0; i < competitor.results.length; i++) {
                    if (competitor.results[i] <= rank) {
                        count++;
                        if (count >= this.majority) {
                            output.push(competitor);
                            break;
                        }
                    }
                }
            });
            return output;
        }
        public $postLink(): void { }
    }
}

comp.controller("competitionController", Competition.Controller);