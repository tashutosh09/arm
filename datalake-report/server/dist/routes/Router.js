"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const RouterRuleMetaData_1 = require("./RouterRuleMetaData");
const RouterLogs_1 = require("./RouterLogs");
const RouterTest_1 = require("./RouterTest");
const RouterRunResults_1 = require("./RouterRunResults");
const RouterLogin_1 = require("./RouterLogin");
const RouterConfig_1 = require("./RouterConfig");
const RouterRuleRunHistory_1 = require("./RouterRuleRunHistory");
const RouterRule_1 = require("./RouterRule");
const RouterRuleGroup_1 = require("./RouterRuleGroup");
const RouterRuleQuery_1 = require("./RouterRuleQuery");
const RouterCompanyNames_1 = require("./RouterCompanyNames");
const feed_route_1 = require("./feed.route");
const RouterIndustryRule_1 = require("./RouterIndustryRule");
const routes = {
    rule: new RouterRule_1.RouterRule(),
    ruleGroup: new RouterRuleGroup_1.RouterRuleGroup(),
    ruleQuery: new RouterRuleQuery_1.RouterRuleQuery(),
    ruleRunHistory: new RouterRuleRunHistory_1.RouterRuleRunHistory(),
    config: new RouterConfig_1.RouterConfig(),
    companies: new RouterCompanyNames_1.RouterCompanyNames(),
    login: new RouterLogin_1.RouterLogin(),
    runResults: new RouterRunResults_1.RouterRunResults(),
    logs: new RouterLogs_1.RouterLogs(),
    test: new RouterTest_1.RouterTest(),
    ruleMetaData: new RouterRuleMetaData_1.RouterRuleMetaData(),
    feed: new feed_route_1.RouterFeed(),
    ruleIndustry: new RouterIndustryRule_1.RouterIndustryRule()
};
exports.default = routes;
