import { Router, Request, Response, NextFunction } from 'express';
import Database from '../database/Database';
import { DbQueries } from '../database/DbQueries';
import { Config } from '../Config';
import { IndustryRuleService } from '../services/IndustryRule';
export class RouterIndustryRule {
    public router: Router

    constructor() {
        this.router = Router();
        this.init();
    }

    init() {
        this.router.post('/:action', this.handle);
    }

    public async handle(req: Request, res: Response, next: NextFunction) {
        console.log("Hello 35");
        const ruleGroupID = req.body.rulegroupID;
        if (req.params && req.params.action) {
            let query = null;
            console.log("====Subrata 1=====");
            switch (req.params.action) {
                case 'get':
                    query = DbQueries.ruleGroups()
                    break;
            }

            if (query) {
                try {
                    const industryRule = await (new IndustryRuleService()).getIndustryRule(ruleGroupID);
                    console.log("IndustryRule "+JSON.stringify(industryRule));
                    res.send({
                        status: true,
                        results: industryRule
                    });

                } catch (err) {
                    res.send({ status: false, results: [] })
                }

                return;
            }
        }
        return next({ status: 400 });
    }
}