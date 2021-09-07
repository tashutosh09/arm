import { Router, Request, Response, NextFunction } from 'express';
import Database from '../database/Database';
import { DbQueries } from '../database/DbQueries';
import { Config } from '../Config';

export class RouterRuleQuery {
    public router: Router

    constructor() {
        this.router = Router();
        this.init();
    }

    init() {
        this.router.post('/:action', this.handle);
    }

    public handle(req: Request, res: Response, next: NextFunction) {
        if (req.params && req.params.action) {

            let query = null;

            switch (req.params.action) {
                case 'get':
                    if (req.body && req.body.RuleID) {
                        query = DbQueries.queries(req.body.RuleID);
                    }
                    break;
            }

            if (query) {
                Database.query(query).then((result) => {
                    res.send({
                        status: true,
                        results: result
                    });
                }, (error) => {
                    return next({ status: 500, reason: error });
                });
                return;
            }
        }
        return next({ status: 400 });
    }
}