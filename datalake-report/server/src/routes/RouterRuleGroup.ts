import { Router, Request, Response, NextFunction } from 'express';
import Database from '../database/Database';
import { DbQueries } from '../database/DbQueries';
import { Config } from '../Config';
import { RuleGroupService } from '../services/RuleGroup';
export class RouterRuleGroup {
    public router: Router

    constructor() {
        this.router = Router();
        this.init();
    }

    init() {
        this.router.post('/:action', this.handle);
    }

    public async handle(req: Request, res: Response, next: NextFunction) {
        if (req.params && req.params.action) {
            let query = null;

            switch (req.params.action) {
                case 'get':
                    query = DbQueries.ruleGroups()
                    break;
            }

            if (query) {
                try {
                    const ruleGroups = await (new RuleGroupService()).getRuleGroups();

                    res.send({
                        status: true,
                        results: ruleGroups
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