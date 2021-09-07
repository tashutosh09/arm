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
const express_1 = require("express");
const DbQueries_1 = require("../database/DbQueries");
const IndustryRule_1 = require("../services/IndustryRule");
class RouterIndustryRule {
    constructor() {
        this.router = express_1.Router();
        this.init();
    }
    init() {
        this.router.post('/:action', this.handle);
    }
    handle(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Hello 35");
            const ruleGroupID = req.body.rulegroupID;
            if (req.params && req.params.action) {
                let query = null;
                console.log("====Subrata 1=====");
                switch (req.params.action) {
                    case 'get':
                        query = DbQueries_1.DbQueries.ruleGroups();
                        break;
                }
                if (query) {
                    try {
                        const industryRule = yield (new IndustryRule_1.IndustryRuleService()).getIndustryRule(ruleGroupID);
                        console.log("IndustryRule " + JSON.stringify(industryRule));
                        res.send({
                            status: true,
                            results: industryRule
                        });
                    }
                    catch (err) {
                        res.send({ status: false, results: [] });
                    }
                    return;
                }
            }
            return next({ status: 400 });
        });
    }
}
exports.RouterIndustryRule = RouterIndustryRule;
