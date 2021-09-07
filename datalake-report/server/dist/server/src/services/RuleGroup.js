"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Database_1 = require("../database/Database");
const DbQueries_1 = require("../database/DbQueries");
class RuleGroupService {
    constructor() {
        this.ruleGroupList = [];
    }
    getRuleGroup(RuleGroupID) {
        return this.ruleGroupList.find(ruleGroupObj => {
            return ruleGroupObj.RuleGroupID === RuleGroupID;
        });
    }
    getSubRuleGroupList(rowDataPackets, RuleGroupID) {
        const subRuleList = [];
        for (const row of rowDataPackets) {
            if (row.RuleGroupID === RuleGroupID) {
                subRuleList.push({
                    RuleGroupID: row.RuleGroupID,
                    RuleSubGroupID: row.RulesubGroupID,
                    RuleGroupName: row.RuleGroupName,
                    RuleSubGroupName: row.RulesubGroupname,
                    isActive: row.IsActive,
                    CompanyFlag: row.CompanyFlag,
                    RuleSubGroupIcon: row.RulesubGroupIcon
                });
            }
        }
        return subRuleList;
    }
    getIndustryRules(ruleGroupId) {
        return __awaiter(this, void 0, void 0, function* () {
            return Database_1.default.query(DbQueries_1.DbQueries.getIndustryGroup(ruleGroupId));
        });
    }
    getRuleSubGroups(industryRuleId) {
        return Database_1.default.query(DbQueries_1.DbQueries.getSubRuleGroup(industryRuleId))
            .then(resp => resp)
            .catch(err => {
            return [];
        });
    }
    _getRuleGroups() {
        return __awaiter(this, void 0, void 0, function* () {
            return Database_1.default.query(DbQueries_1.DbQueries.ruleGroups())
                .then((rowDataPackets) => __awaiter(this, void 0, void 0, function* () {
                const ruleGroupList = rowDataPackets.map((row) => __awaiter(this, void 0, void 0, function* () {
                    const { RuleGroupID, RuleGroupName, RuleGroupSystemName, DefaultHiveTable, CompanyFlag, RuleGroupIcon } = row;
                    let indGroupList = [];
                    try {
                        const industryRuleList = yield this.getIndustryRules(RuleGroupID);
                        if (industryRuleList.length > 0) {
                            indGroupList = industryRuleList.map((indRule) => __awaiter(this, void 0, void 0, function* () {
                                const { RuleGroupID, RuleIndustryID, RuleIndustryName, RuleIndustryIcon, IsActive } = indRule;
                                try {
                                }
                                catch (err) {
                                    const subRuleList = yield this.getRuleSubGroups(RuleIndustryID);
                                    return {
                                        RuleGroupID,
                                        RuleIndustryID,
                                        RuleIndustryName,
                                        RuleIndustryIcon,
                                        IsActive,
                                        RuleSubGroupList: subRuleList
                                    };
                                }
                            }));
                            return Promise.all(indGroupList)
                                .then(indGroupListResp => {
                                return {
                                    RuleGroupID,
                                    RuleGroupName,
                                    RuleGroupSystemName,
                                    DefaultHiveTable,
                                    CompanyFlag,
                                    RuleGroupIcon,
                                    RuleIndustryList: indGroupListResp
                                };
                            });
                        }
                    }
                    catch (err) {
                        console.log(err);
                        indGroupList = [];
                    }
                }));
                return Promise.all(ruleGroupList);
            })).catch(err => console.log(err));
        });
    }
    getRuleGroups() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const ruleGroupList = yield Database_1.default.query(DbQueries_1.DbQueries.ruleGroups());
                let industryList = [];
                for (let rule of ruleGroupList) {
                    const { RuleGroupID } = rule;
                    const industryRuleGroupList = yield this.getIndustryRules(RuleGroupID);
                    let subRuleList = [];
                    for (let industry of industryRuleGroupList) {
                        const { RuleIndustryID } = industry;
                        const subRuleGroupList = yield this.getRuleSubGroups(RuleIndustryID);
                        subRuleList.push(Object.assign({}, industry, { subRuleGroupList }));
                    }
                    industryList.push(Object.assign({}, rule, { industryList: subRuleList }));
                }
                return industryList;
            }
            catch (err) {
                return err;
            }
        });
    }
    getRuleGroupList() {
        return this.ruleGroupList;
    }
}
exports.RuleGroupService = RuleGroupService;
