import { RouterRuleMetaData } from './RouterRuleMetaData';
import { RouterLogs } from './RouterLogs';
import { RouterTest } from './RouterTest';
import { RouterRunResults } from './RouterRunResults';
import { RouterLogin } from './RouterLogin';
import { RouterConfig } from './RouterConfig';
import { RouterRuleRunHistory } from './RouterRuleRunHistory';
import { RouterRule } from "./RouterRule";
import { RouterRuleGroup } from "./RouterRuleGroup";
import { RouterRuleQuery } from "./RouterRuleQuery";
import { RouterCompanyNames } from './RouterCompanyNames';
import { RouterFeed } from './feed.route';
import { RouterIndustryRule } from './RouterIndustryRule';

const routes = {
    rule: new RouterRule(),
    ruleGroup: new RouterRuleGroup(),
    ruleQuery: new RouterRuleQuery(),
    ruleRunHistory: new RouterRuleRunHistory(),
    config: new RouterConfig(),
    companies: new RouterCompanyNames(),
    login: new RouterLogin(),
    runResults: new RouterRunResults(),
    logs: new RouterLogs(),
    test: new RouterTest(),
    ruleMetaData: new RouterRuleMetaData(),
    feed: new RouterFeed(),
    ruleIndustry: new RouterIndustryRule()
}

export default routes;